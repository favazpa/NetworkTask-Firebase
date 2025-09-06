import en from './en.json';
import ar from './ar.json';

// Define the translation structure type
export type TranslationKeys = typeof en;

// Define supported languages
export type Language = 'en' | 'ar';

// Translation object
const translations = {
  en,
  ar,
} as const;

// Function to get translations for a specific language
export const getTranslations = (language: Language): TranslationKeys => {
  return translations[language];
};

// Function to get all available languages
export const getAvailableLanguages = (): Language[] => {
  return Object.keys(translations) as Language[];
};

// Function to check if a language is supported
export const isLanguageSupported = (language: string): language is Language => {
  return language in translations;
};

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Export individual translation objects for direct access if needed
export { en, ar };
