import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enRes from '../locales/en/translation.json';
import thRes from '../locales/th/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enRes },
      th: { translation: thRes }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false } 
  });

export default i18n;