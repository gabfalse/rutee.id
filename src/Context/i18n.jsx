import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// definisi bahasa
const resources = {
  en: {
    translation: {
      "Your Personality Result": "Your Personality Result",
      "No personality data yet.": "No personality data yet.",
      Strength: "Strength",
      Weakness: "Weakness",
      "Suitable roles": "Suitable roles",
      "Result saved on": "Result saved on",
      "Download as PNG": "Download as PNG",
    },
  },
  id: {
    translation: {
      "Your Personality Result": "Hasil Kepribadian Anda",
      "No personality data yet.": "Belum ada data kepribadian.",
      Strength: "Kekuatan",
      Weakness: "Kelemahan",
      "Suitable roles": "Peran yang sesuai",
      "Result saved on": "Hasil disimpan pada",
      "Download as PNG": "Unduh sebagai PNG",
    },
  },
};

// init i18n
i18n.use(initReactI18next).init({
  resources,
  lng: "id", // default bahasa
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
