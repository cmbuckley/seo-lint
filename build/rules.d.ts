export declare const rules: ({
    name: string;
    description: string;
    supportsMetaRefresh: boolean;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        response: {
            url: string;
            meta?: undefined;
            ok?: undefined;
        };
        result: {
            canonical: {
                rel: string;
                href: string;
                innerText: string;
                innerHTML: string;
            }[];
            title?: undefined;
            meta?: undefined;
            h1s?: undefined;
            h2s?: undefined;
            h3s?: undefined;
            h4s?: undefined;
            h5s?: undefined;
            h6s?: undefined;
            aTags?: undefined;
            imgs?: undefined;
        };
    };
    validator: (payload: any, tester: any) => Promise<void>;
} | {
    name: string;
    description: string;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        result: {
            title: {
                innerText: string;
                innerHTML: string;
            }[];
            canonical?: undefined;
            meta?: undefined;
            h1s?: undefined;
            h2s?: undefined;
            h3s?: undefined;
            h4s?: undefined;
            h5s?: undefined;
            h6s?: undefined;
            aTags?: undefined;
            imgs?: undefined;
        };
        response?: undefined;
    };
    validator: (payload: any, tester: any) => Promise<void>;
    supportsMetaRefresh?: undefined;
} | {
    name: string;
    description: string;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        result: {
            meta: {
                name: string;
                content: string;
            }[];
            title: {
                innerText: string;
                innerHTML: string;
            }[];
            canonical?: undefined;
            h1s?: undefined;
            h2s?: undefined;
            h3s?: undefined;
            h4s?: undefined;
            h5s?: undefined;
            h6s?: undefined;
            aTags?: undefined;
            imgs?: undefined;
        };
        response?: undefined;
    };
    validator: (payload: any, tester: any) => Promise<void>;
    supportsMetaRefresh?: undefined;
} | {
    name: string;
    description: string;
    supportsMetaRefresh: boolean;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        result: {
            meta: {
                'http-equiv': string;
                content: string;
            }[];
            canonical?: undefined;
            title?: undefined;
            h1s?: undefined;
            h2s?: undefined;
            h3s?: undefined;
            h4s?: undefined;
            h5s?: undefined;
            h6s?: undefined;
            aTags?: undefined;
            imgs?: undefined;
        };
        response?: undefined;
    };
    validator: (payload: any, tester: any) => Promise<void>;
} | {
    name: string;
    description: string;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        result: {
            title: {
                innerText: string;
                innerHTML: string;
            }[];
            h1s: {
                innerText: string;
                innerHTML: string;
            }[];
            h2s: {
                innerText: string;
                innerHTML: string;
            }[];
            h3s: {
                innerText: string;
                innerHTML: string;
            }[];
            h4s: any[];
            h5s: any[];
            h6s: any[];
            canonical?: undefined;
            meta?: undefined;
            aTags?: undefined;
            imgs?: undefined;
        };
        response?: undefined;
    };
    validator: (payload: any, tester: any) => Promise<void>;
    supportsMetaRefresh?: undefined;
} | {
    name: string;
    description: string;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        response: {
            meta: ({
                charset: string;
                name?: undefined;
                content?: undefined;
            } | {
                name: string;
                content: string;
                charset?: undefined;
            })[];
            url?: undefined;
            ok?: undefined;
        };
        result?: undefined;
    };
    validator: (payload: any, tester: any) => Promise<void>;
    supportsMetaRefresh?: undefined;
} | {
    name: string;
    description: string;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        response: {
            ok: boolean;
            url: string;
            meta?: undefined;
        };
        result: {
            aTags: {
                tag: string;
                innerHTML: string;
                innerText: string;
                href: string;
                class: string;
            }[];
            canonical?: undefined;
            title?: undefined;
            meta?: undefined;
            h1s?: undefined;
            h2s?: undefined;
            h3s?: undefined;
            h4s?: undefined;
            h5s?: undefined;
            h6s?: undefined;
            imgs?: undefined;
        };
    };
    validator: (payload: any, tester: any) => Promise<void>;
    supportsMetaRefresh?: undefined;
} | {
    name: string;
    description: string;
    testData: {
        preferences: {
            internalLinksLowerCase: boolean;
            internalLinksTrailingSlash: boolean;
            metaRefreshRules: import("./Tester").MetaRefreshRulePreference;
        };
        response: {
            ok: boolean;
            url: string;
            meta?: undefined;
        };
        result: {
            imgs: {
                tag: string;
                innerHTML: string;
                innerText: string;
                src: string;
                alt: string;
                style: string;
            }[];
            canonical?: undefined;
            title?: undefined;
            meta?: undefined;
            h1s?: undefined;
            h2s?: undefined;
            h3s?: undefined;
            h4s?: undefined;
            h5s?: undefined;
            h6s?: undefined;
            aTags?: undefined;
        };
    };
    validator: (payload: any, tester: any) => Promise<void>;
    supportsMetaRefresh?: undefined;
})[];
