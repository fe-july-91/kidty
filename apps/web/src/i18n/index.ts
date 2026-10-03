import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk';
import en from './locales/en';

export const LANGUAGES = ['uk', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = 'kidty-lang';

function savedLanguage(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'uk';
  } catch {
    return 'uk';
  }
}

i18n.use(initReactI18next).init({
  resources: { uk: { translation: uk }, en: { translation: en } },
  lng: savedLanguage(),
  fallbackLng: 'uk',
  interpolation: { escapeValue: false }, // React already escapes
});

document.documentElement.lang = i18n.language;
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Storage unavailable: the choice lasts for this session only.
  }
});

export default i18n;
