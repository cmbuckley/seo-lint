#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sade_1 = __importDefault(require("sade"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Tester_1 = require("./Tester");
sade_1.default('seo-lint <dir>', true)
    .version('1.0.0')
    .describe('Check a directory of HTML files for common SEO issues.')
    .example('public -H example.com -c seo-lint.config.js -w report.json')
    .option('-H, --host', 'Set the expected host for internal links. (example.com)')
    .option('-c, --config', 'Set a custom config to specify rules.')
    .option('-w, --write', 'Location to write a report to a JSON file.')
    .action(async (dir, opts) => {
    try {
        let config, writeLocation;
        if (opts.config) {
            const configLocation = path_1.default.resolve(opts.config);
            if (fs_1.default.existsSync(configLocation)) {
                config = require(configLocation);
            }
            else {
                throw Error(`No config found at ${configLocation}`);
            }
        }
        console.log('latest');
        if (opts.write) {
            writeLocation = path_1.default.resolve(opts.write);
        }
        else if (config && config.writeLocation) {
            writeLocation = path_1.default.resolve(config.writeLocation);
        }
        if (writeLocation) {
            const parsedWL = path_1.default.parse(writeLocation);
            if (parsedWL.ext !== '.json') {
                throw new Error('--write or writeLocation in config must write to a .json file.');
            }
            if (!fs_1.default.existsSync(parsedWL.dir)) {
                fs_1.default.mkdirSync(parsedWL.dir, { recursive: true });
            }
        }
        // Program handler
        const tester = Tester_1.Tester({ siteWide: true, host: opts.host ? opts.host : '', ...config });
        const { meta, ...results } = await tester.folder(dir);
        if (Object.keys(results).length > 0) {
            console.log(results);
            if (writeLocation) {
                fs_1.default.writeFileSync(writeLocation, JSON.stringify({ success: false, meta, results }, null, 2), {
                    encoding: 'utf-8',
                });
            }
        }
        else {
            console.log(`No SEO issues detected.`);
            if (writeLocation) {
                fs_1.default.writeFileSync(writeLocation, JSON.stringify({ success: true, meta, results }, null, 2), {
                    encoding: 'utf-8',
                });
            }
        }
    }
    catch (e) {
        console.error(e);
    }
})
    .parse(process.argv);
