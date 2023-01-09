import React from "react";
import { useTranslation as useNextTranslation } from "next-i18next";

export const useCustomTranslation = () => {
  const {
    t: translate,
    i18n: { changeLanguage, language },
  } = useNextTranslation();

  const t = React.useCallback(
    (phrase: string) => {
      const translated = translate(phrase);
      return translated || phrase;
    },
    [translate]
  );

  return { t, changeLanguage, language };
};
