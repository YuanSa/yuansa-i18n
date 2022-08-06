import {
  createContext,
  createElement,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useLocalStorageState } from "ahooks";
import { IntlProvider } from "react-intl";
import { I18nConfig, Locale, I18nDict, I18nProviderProps } from "./types";

export const I18nContext = createContext<I18nConfig>({
  locale: "",
  setLocale: () => null,
  i18nDict: {},
  isLoadingRemoteI18nDict: true,
  isFollowingSystemLocale: true,
});

export const I18nProvider = ({
  remoteI18nDictURL,
  remoteI18nDictURLMap = {},
  remoteI18nDictFetcher = (remoteURL) =>
    window.fetch(remoteURL).then((res) => res.json()),
  fallbackBaseOnChanging = "previous",
  onLoadI18nDictError,
  defaultLocale,
  localeNormalizer = (raw) => (raw ?? "").toString(),
  localI18nDict,
  localI18nDictMap,
  localStorageCacheKey = "yuansa-i18n-language-code",
  children,
}: I18nProviderProps) => {
  // ==========
  // locale
  // ==========

  const [localLocale, setLocalLocale] = useLocalStorageState<Locale | null>(
    localStorageCacheKey,
    {
      defaultValue: defaultLocale,
      deserializer: (raw) => localeNormalizer(JSON.parse(raw)),
    }
  );
  const systemLocale = localeNormalizer(window.navigator.language);
  const locale = localLocale || defaultLocale || systemLocale || "";
  const setLocale = useCallback(
    (newLocale: Locale | null = null) =>
      setLocalLocale(localeNormalizer(newLocale)),
    [setLocalLocale, localeNormalizer]
  );

  // ==========
  // i18n dict
  // ==========

  const defaultI18nDict = useMemo(
    () => localI18nDict || localI18nDictMap?.[locale] || {},
    [localI18nDict, localI18nDictMap?.[locale]]
  );
  const [i18nDict, setI18nDict] = useState<I18nDict>(defaultI18nDict);

  const getI18nDict = useCallback(
    (targetLocale: Locale) => {
      const normalizedTargetLocale = localeNormalizer(targetLocale) ?? "";
      return {
        localI18nDict:
          localI18nDict || localI18nDictMap?.[normalizedTargetLocale] || {},
        remoteI18nDictURL:
          remoteI18nDictURL ||
          remoteI18nDictURLMap?.[normalizedTargetLocale] ||
          "",
      };
    },
    [
      localeNormalizer,
      localI18nDict,
      localI18nDictMap,
      remoteI18nDictURL,
      remoteI18nDictURLMap,
    ]
  );

  const updateI18nDict = useCallback(
    (patchI18nDict: I18nDict) => {
      const newI18nDict = Object.assign(
        {},
        fallbackBaseOnChanging === "none" ? {} : defaultI18nDict,
        fallbackBaseOnChanging === "default" ? {} : i18nDict,
        patchI18nDict
      );
      setI18nDict(newI18nDict);
      return newI18nDict;
    },
    [fallbackBaseOnChanging, i18nDict, defaultI18nDict, setI18nDict]
  );

  // ==========
  // update i18n dict on locale changing
  // ==========

  const [isLoadingRemoteI18nDict, setIsLoadingRemoteI18nDict] = useState(true);
  useEffect(() => {
    const { localI18nDict, remoteI18nDictURL } = getI18nDict(locale);
    // Local dict as backup
    updateI18nDict(localI18nDict);
    // Remote dict as supplemental
    if (remoteI18nDictURL) {
      setIsLoadingRemoteI18nDict(true);
      remoteI18nDictFetcher(remoteI18nDictURL)
        .then((newRemoteI18nDict) => {
          updateI18nDict(newRemoteI18nDict);
        })
        .catch((rawError) => {
          if (onLoadI18nDictError) {
            try {
              onLoadI18nDictError(rawError);
            } catch (caughtError) {
              console.warn(
                `[yuansa-i18n]  Failed to fetch new remote i18n dict from url "${remoteI18nDictURL}":`,
                caughtError ?? rawError
              );
            }
          } else {
            console.error(
              `[yuansa-i18n] Failed to fetch new remote i18n dict from url "${remoteI18nDictURL}":`,
              rawError
            );
          }
        })
        .finally(() => setIsLoadingRemoteI18nDict(false));
    }
  }, [locale, getI18nDict, updateI18nDict, remoteI18nDictFetcher]);

  // ==========
  // utility flags
  // ==========

  const isFollowingSystemLocale = Boolean(!localLocale && systemLocale);

  // ==========
  // expose
  // ==========

  const languageContextValue = useMemo<I18nConfig>(
    () => ({
      locale,
      setLocale,
      i18nDict,
      isLoadingRemoteI18nDict,
      isFollowingSystemLocale,
    }),
    [
      locale,
      setLocale,
      i18nDict,
      isLoadingRemoteI18nDict,
      isFollowingSystemLocale,
    ]
  );

  return createElement(
    I18nContext.Provider,
    { value: languageContextValue },
    createElement(
      IntlProvider,
      { messages: i18nDict, locale, defaultLocale: defaultLocale },
      children
    )
  );
};
