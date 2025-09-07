import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Language detection
const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Try to get stored language preference
      const storedLanguage = await AsyncStorage.getItem('user-language');
      if (storedLanguage) {
        callback(storedLanguage);
        return;
      }

      // Fallback to device locale
      const locales = getLocales();
      const deviceLanguage = locales[0]?.languageCode || 'en';
      
      // Map device language to supported languages
      const supportedLanguage = deviceLanguage === 'ar' ? 'ar' : 'en';
      callback(supportedLanguage);
    } catch (error) {
      console.error('Language detection error:', error);
      callback('en'); // Fallback to English
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

// i18n configuration
i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // For React Native compatibility
    fallbackLng: 'en',
    debug: __DEV__,
    
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
