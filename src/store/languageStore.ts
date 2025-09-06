import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import { getTranslations, Language, TranslationKeys } from '../locales';
import { STORAGE_KEYS, LANGUAGES, DEFAULTS } from '../shared/constants';

type LanguageState = {
  currentLanguage: Language;
  isRTL: boolean;
  translations: TranslationKeys;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  initializeRTL: () => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: DEFAULTS.LANGUAGE,
      isRTL: false,
      translations: getTranslations(DEFAULTS.LANGUAGE),

      setLanguage: (language) => {
        const isRTL = language === LANGUAGES.AR;
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        
        // Only restart if language actually changed
        if (currentLanguage !== language) {
          const translations = getTranslations(language);
          
          set({
            currentLanguage: language,
            isRTL,
            translations,
          });
          
          // Force RTL/LTR layout
          I18nManager.forceRTL(isRTL);
          
          // Show restart dialog
          Alert.alert(
            'Restart Required',
            'The app needs to restart to apply the language changes.',
            [
              {
                text: 'Restart Now',
                onPress: () => {
                  RNRestart.restart();
                },
              },
            ],
            { cancelable: false }
          );
        }
      },

      toggleLanguage: () => {
        const currentLanguage = useLanguageStore.getState().currentLanguage;
        const newLanguage = currentLanguage === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN;
        const isRTL = newLanguage === LANGUAGES.AR;
        const translations = getTranslations(newLanguage);
        
        set({
          currentLanguage: newLanguage,
          isRTL,
          translations,
        });
        
        // Force RTL/LTR layout
        I18nManager.forceRTL(isRTL);
        
        // Show restart dialog
        Alert.alert(
          'Restart Required',
          'The app needs to restart to apply the language changes.',
          [
            {
              text: 'Restart Now',
              onPress: () => {
                RNRestart.restart();
              },
            },
          ],
          { cancelable: false }
        );
      },

      initializeRTL: () => {
        const { currentLanguage } = get();
        const isRTL = currentLanguage === LANGUAGES.AR;
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(isRTL);
        console.log('RTL initialized on startup:', isRTL, 'for language:', currentLanguage);
      },
    }),
    {
      name: STORAGE_KEYS.LANGUAGE,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

