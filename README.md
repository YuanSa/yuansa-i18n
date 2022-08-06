# yuansa-i18n

> **Notice:** This is an experimental package with no reliable testing so it may has unknown bugs. You are warmly welcomed to use it to test and report bugs~ Thank you!

A tool that helps you to auto config manage `react-intl`. By several simple configuration like "your locale file url", you will be able to use `react-intl`, no more frustrating contexts settings needed.

`yuansa-i18n` will enable you to:

- Manage locales with hooks
- Have fallbacks when Text's key is missing
- Fetch texts conditionally and remotely
- Cache user's locale preference in `window.localStorage` **(Will use `window.navigator.language` as fallback locale if no `defaultLocale` found)**

## Get Started

1. Install `yuansa-i18n` by running the following command:

   ```bash
   # if you use npm as your package manager, run:
   npm install --save yuansa-i18n

   # if you use yarn as your package manager, run:
   yarn add yuansa-i18n

   # if you use pnpm as your package manager, run:
   pnpm add yuansa-i18n
   ```

   **But if you are using a monorepo, please refer to the document of your monorepo engine to get the right command.**

2. Wrap your APP with `I18nProvider` from `yuansa-i18n` and pass your configuration to it:

   ```tsx
   import { FC } from "react";
   import { I18nProvider } from "yuansa-i18n";
   import { enUS, zhCN, esMX } from "@/locale";

   const i18nConfig = {
     remoteI18nDictURLMap: {
       "en-US": "/locale/en-US.json",
       "zh-CN": "/locale/zh-CN.json",
       "es-MX": "/locale/es-MX.json",
     },
     localeI18nDictMap: {
       "en-US": enUS,
       "zh-CN": zhCN,
       "es-MX": esMX,
     },
     defaultLocale: "en-US",
   };

   const APP: FC = () => (
     <I18nProvider {...i18nConfig}>
       <MyAPP />
     </I18nProvider>
   );
   ```

3. You can use `i18n` from `yuansa-i18n` or traditional `intl` from `react-intl` in your APP as you wish.

   ```tsx
   import { useIntl } from "react-intl";
   import { useI18n } from "yuansa-i18n";

   // Traditional `useIntl`
   const ExampleA = () => {
     const intl = useIntl();

     return intl.formatMessage({ id: "example" });
   };

   // Get i18n states from `useI18n().i18n`
   // You can also get `intl` from `useI18n()`
   const ExampleB = () => {
     const { i18n, intl } = useI18n();
     const { locale, setLocale, isLoadingRemoteI18nDict } = i18n;

     return (
       <>
         <span>Current lang: {locale}</span>
         <button onClick={() => setLocale("zh-CN")}>
           {intl.formatMessage({
             id: isLoadingRemoteI18nDict ? "loading" : "change_lang",
           })}
         </button>
       </>
     );
   };
   ```

## Manual

### Customize Locale Normalizer (Deserializer)

**TODO**

### Use Local Locale

**TODO**

### Customize LocalStorage Key

**TODO**

### Choose Fallback Behavior when Fetching the New Locale

**TODO**

### Use Remote Locale Files

**TODO**

#### Catch Error when Fetching Remote Locale Files

**TODO**
