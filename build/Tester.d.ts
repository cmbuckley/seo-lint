export declare const enum MetaRefreshRulePreference {
    All = "all",
    Supported = "supported",
    None = "none"
}
export declare const defaultPreferences: {
    internalLinksLowerCase: boolean;
    internalLinksTrailingSlash: boolean;
    metaRefreshRules: MetaRefreshRulePreference;
};
declare type TLinkers = {
    [key: string]: string[];
};
export declare const Tester: ({ rules, display, siteWide, host, preferences, }: {
    rules?: any[];
    display?: string[];
    siteWide?: boolean;
    host?: string;
    preferences?: any;
}) => {
    test: (html: string, url: string) => Promise<any[]>;
    reset: () => void;
    folder: (folder: any) => Promise<{
        meta: {
            whatLinksWhere: TLinkers;
        };
    }>;
};
export {};
