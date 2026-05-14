import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import zh from './locales/zh.json';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

const LANGUAGE_KEY = 'app_language';

export async function setLanguage(lang: string) {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export default i18n;