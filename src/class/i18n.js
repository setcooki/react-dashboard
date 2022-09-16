import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locale/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: en
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: false,
    react: {
      wait: true
    }
  });

export default i18n;