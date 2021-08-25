"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tester = exports.defaultPreferences = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const sync_1 = require("totalist/sync");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rules_1 = require("./rules");
;
exports.defaultPreferences = {
    internalLinksLowerCase: true,
    internalLinksTrailingSlash: true,
    metaRefreshRules: "supported" /* Supported */,
};
const getHtmlFiles = (p) => {
    const html = new Set();
    sync_1.totalist(p, (name, abs, stats) => {
        if (/\.html$/.test(name) && !name.includes('node_modules')) {
            html.add(abs);
        }
    });
    return [...html];
};
const $attributes = ($, search) => {
    const arr = [];
    $(search).each(function () {
        const namespace = $(this)[0].namespace;
        if (!namespace || namespace.includes('html')) {
            const out = {
                tag: $(this)[0].name,
                innerHTML: $(this).html(),
                innerText: $(this).text(),
            };
            if ($(this)[0].attribs) {
                Object.entries($(this)[0].attribs).forEach((attr) => {
                    out[attr[0].toLowerCase()] = attr[1];
                });
            }
            arr.push(out);
        }
    });
    return arr;
};
const emptyRule = {
    name: '',
    description: '',
    supportsMetaRefresh: false,
    success: false,
    errors: [],
    warnings: [],
    info: [],
};
const Tester = function ({ rules = [], display = ['errors', 'warnings'], siteWide = false, host = '', preferences = {}, }) {
    preferences = { ...exports.defaultPreferences, ...preferences };
    this.currentRule = JSON.parse(JSON.stringify(emptyRule));
    this.currentUrl = '';
    const rulesToUse = rules.length > 0 ? rules : rules_1.rules;
    const internalLinks = []; //[[link, linkedFrom]]
    const pagesSeen = new Set();
    const siteWideLinks = new Map();
    const titleTags = new Map();
    const metaDescriptions = new Map();
    let results = [];
    const siteResults = {
        duplicateTitles: [],
        duplicateMetaDescriptions: [],
        orphanPages: [],
        brokenInternalLinks: [],
    };
    const logMetaDescription = (meta) => {
        if (metaDescriptions.has(meta)) {
            siteResults.duplicateMetaDescriptions.push([metaDescriptions.get(meta), this.currentUrl]);
        }
        else {
            metaDescriptions.set(meta, this.currentUrl);
        }
    };
    const logTitleTag = (title) => {
        if (titleTags.has(title)) {
            siteResults.duplicateTitles.push([titleTags.get(title), this.currentUrl]);
        }
        else {
            titleTags.set(title, this.currentUrl);
        }
    };
    const noEmptyRule = () => {
        if (!this.currentRule.name || this.currentRule.name.length === 0)
            throw Error('No current test name');
        if (!this.currentRule.description || this.currentRule.description.length === 0)
            throw Error('No current test description');
    };
    const runTest = (defaultPriority = 50, arrName) => {
        return (t, ...params) => {
            let test = t;
            let priority = defaultPriority;
            // allows overwriting of priority
            if (typeof test !== 'function') {
                priority = t;
                test = params.splice(0, 1)[0];
            }
            noEmptyRule();
            this.count += 1;
            try {
                return test(...params);
            }
            catch (e) {
                this.currentRule[arrName].push({ message: e.message, priority });
                return e;
            }
        };
    };
    const startRule = ({ validator, test, testData, ...payload }) => {
        if (this.currentRule.errors.length > 0)
            throw Error("Starting a new rule when there are errors that haven't been added to results. Did you run 'finishRule'? ");
        if (this.currentRule.warnings.length > 0)
            throw Error("Starting a new rule when there are warnings that haven't been added to results. Did you run 'finishRule'? ");
        this.currentRule = Object.assign(this.currentRule, payload);
    };
    const finishRule = () => {
        if (this.currentRule.errors.length === 0 && this.currentRule.warnings.length === 0)
            this.currentRule.success = true;
        results.push(this.currentRule);
        this.currentRule = JSON.parse(JSON.stringify(emptyRule));
    };
    const reset = () => {
        results = [];
    };
    const test = async (html, url) => {
        try {
            this.currentUrl = url;
            pagesSeen.add(url);
            const $ = cheerio_1.default.load(html);
            const result = {
                html: $attributes($, 'html'),
                title: $attributes($, 'title'),
                meta: $attributes($, 'head meta'),
                ldjson: $attributes($, 'script[type="application/ld+json"]'),
                h1s: $attributes($, 'h1'),
                h2s: $attributes($, 'h2'),
                h3s: $attributes($, 'h3'),
                h4s: $attributes($, 'h4'),
                h5s: $attributes($, 'h5'),
                h6s: $attributes($, 'h6'),
                canonical: $attributes($, '[rel="canonical"]'),
                imgs: $attributes($, 'img'),
                aTags: $attributes($, 'a'),
                linkTags: $attributes($, 'link'),
                ps: $attributes($, 'p'),
            };
            const metaRefresh = result.meta.filter((m) => m['http-equiv'] && m['http-equiv'].toLowerCase() === 'refresh');
            if (siteWide) {
                siteWideLinks.set(url, result.aTags);
                if (result.title[0] && result.title[0].innerText) {
                    logTitleTag(result.title[0].innerText);
                }
                const metaDescription = result.meta.find((m) => m.name && m.name.toLowerCase() === 'description');
                if (metaDescription) {
                    logMetaDescription(metaDescription.content);
                }
                result.aTags
                    .filter((a) => !!a.href)
                    .map((a) => {
                    a.href = a.href.replace(new RegExp(`https?://${host}`), '');
                    return a;
                })
                    .filter((a) => !a.href.includes('http'))
                    .filter((a) => !a.href.includes('mailto:'))
                    .filter((a) => {
                    if (this.currentUrl !== '/') {
                        return !a.href.endsWith(this.currentUrl);
                    }
                    return true;
                })
                    .filter((a) => a.href !== this.currentUrl)
                    .map((a) => a.href.replace(/#.+$/, '')) // remove fragment
                    .filter(Boolean) // remove now empty fragment-only links
                    .forEach((a) => internalLinks.push([a, this.currentUrl]));
                metaRefresh
                    .filter((m) => m.content && m.content.includes('url='))
                    .map((m) => m.content.split('=')[1].replace(new RegExp(`https?://${host}`), ''))
                    .filter((u) => !u.includes('http'))
                    .filter((u) => {
                    if (this.currentUrl !== '/') {
                        return !u.endsWith(this.currentUrl);
                    }
                    return true;
                })
                    .filter((u) => u !== this.currentUrl)
                    .map((u) => u.replace(/#.+$/, '')) // remove fragment
                    .filter(Boolean) // remove now empty fragment-only links
                    .forEach((u) => internalLinks.push([u, this.currentUrl]));
            }
            for (let i = 0; i < rulesToUse.length; i++) {
                const rule = rulesToUse[i];
                if (!metaRefresh.length ||
                    (preferences.metaRefreshRules == "all" /* All */ ||
                        (preferences.metaRefreshRules == "supported" /* Supported */ && rule.supportsMetaRefresh))) {
                    startRule(rule);
                    await rule.validator({ result, response: { url, host }, preferences }, {
                        test: runTest(70, 'errors'),
                        lint: runTest(40, 'warnings'),
                    });
                    finishRule();
                }
            }
            const validDisplay = ['warnings', 'errors'];
            const out = display
                .filter((d) => validDisplay.includes(d))
                .reduce((out, key) => {
                return [
                    ...out,
                    ...results
                        .filter((r) => !r.success)
                        .reduce((o, ruleResult) => {
                        return [
                            ...o,
                            ...ruleResult[key]
                                .sort((a, b) => a.priority - b.priority)
                                .map((r) => ({ ...r, level: key })),
                        ];
                    }, []),
                ];
            }, []);
            if (siteWide) {
                siteResults[url] = out;
            }
            else {
                return out;
            }
            results = [];
        }
        catch (e) {
            console.error(e);
        }
    };
    return {
        test,
        reset,
        folder: async (folder) => {
            const parsedFolder = path_1.default.parse(path_1.default.resolve(folder));
            const normalizedFolder = `${parsedFolder.dir}/${parsedFolder.base}`;
            const files = getHtmlFiles(normalizedFolder);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const html = fs_1.default.readFileSync(path_1.default.resolve(file), { encoding: 'utf-8' });
                const relPermalink = file.replace('index.html', '').replace(normalizedFolder, '');
                // eslint-disable-next-line jest/expect-expect
                await test(html, relPermalink);
            }
            for (const page of pagesSeen.values()) {
                if (!internalLinks.find((il) => il[0] === page))
                    siteResults.orphanPages.push(page);
            }
            for (const [link, linker] of internalLinks) {
                if (!pagesSeen.has(link))
                    siteResults.brokenInternalLinks.push({ link, linker });
            }
            const whatLinksWhere = {};
            for (const [linker, links] of siteWideLinks.entries()) {
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    if (!whatLinksWhere[link.href])
                        whatLinksWhere[link.href] = [];
                    whatLinksWhere[link.href].push(linker);
                }
            }
            const outResults = Object.keys(siteResults).reduce((out, key) => {
                if (Array.isArray(siteResults[key]) && siteResults[key].length > 0) {
                    out[key] = siteResults[key];
                }
                return out;
            }, { meta: { whatLinksWhere } });
            return outResults;
        },
    };
};
exports.Tester = Tester;
