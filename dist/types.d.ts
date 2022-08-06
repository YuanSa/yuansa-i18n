import { ReactNode } from "react";
export declare type Locale = string;
export declare type I18nDict = Record<string, string>;
export declare type I18nDictMap = Record<Locale, I18nDict>;
export declare type I18nObject = Partial<Record<Locale, string>>;
export declare type I18nItem = string | I18nObject;
export declare type I18nConfig = {
    locale: Locale;
    isFollowingSystemLocale: boolean;
    setLocale: (newLocale?: Locale) => void;
    i18nDict: I18nDict;
    isLoadingRemoteI18nDict: boolean;
};
export declare type I18nDictFallbackBase = "default" | "previous" | "none";
export interface I18nProviderProps {
    remoteI18nDictURL?: string;
    remoteI18nDictURLMap?: Record<Locale, string>;
    remoteI18nDictFetcher?: (remoteURL: string) => Promise<I18nDict>;
    fallbackBaseOnChanging?: I18nDictFallbackBase;
    onLoadI18nDictError?: (error: any) => unknown;
    defaultLocale?: Locale;
    localeNormalizer?: (rawLangCode?: any) => Locale | null;
    localI18nDict?: I18nDict;
    localI18nDictMap?: Record<Locale, I18nDict>;
    localStorageCacheKey?: string;
    children?: ReactNode;
}
