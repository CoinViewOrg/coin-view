import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { commonEN } from "@coin-view/tests-data";

export const instanceEN = i18next.createInstance();

instanceEN.use(initReactI18next).init({
  debug: true,
  lng: "en",
  resources: {
    en: {
      translation: commonEN,
    },
  },
});
