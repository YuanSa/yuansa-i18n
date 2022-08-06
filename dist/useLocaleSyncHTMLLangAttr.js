import { useEffect } from "react";
import { useIntl } from "react-intl";
export const useLocaleSyncHTMLLangAttr = () => {
    const intl = useIntl();
    useEffect(() => {
        window.document.getElementsByTagName("html")[0].lang = intl.locale;
    }, [intl.locale]);
};
