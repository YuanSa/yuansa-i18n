/// <reference types="react" />
import { I18nConfig, I18nProviderProps } from "./types";
export declare const I18nContext: import("react").Context<I18nConfig>;
export declare const I18nProvider: ({ remoteI18nDictURL, remoteI18nDictURLMap, remoteI18nDictFetcher, fallbackBaseOnChanging, onLoadI18nDictError, defaultLocale, localeNormalizer, localI18nDict, localI18nDictMap, localStorageCacheKey, children, }: I18nProviderProps) => import("react").FunctionComponentElement<import("react").ProviderProps<I18nConfig>>;
