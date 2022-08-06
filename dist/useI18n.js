import { useContext } from "react";
import { useIntl } from "react-intl";
import { I18nContext } from "./I18n";
export const useI18n = () => ({
    i18n: useContext(I18nContext),
    intl: useIntl(),
});
