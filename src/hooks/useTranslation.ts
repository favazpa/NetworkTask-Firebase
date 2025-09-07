import { useTranslation as useI18nTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import { Alert } from 'react-native';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = async (language: string) => {
    try {
      const isRTL = language === 'ar';
      
      // Configure I18nManager
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isRTL);
      
      // Change language
      await i18n.changeLanguage(language);
      
      // Get translations for the new language
      const newTranslations = i18n.getResourceBundle(language, 'translation');
      
      // Show restart dialog with new language translations
      Alert.alert(
        newTranslations?.common?.restartRequired || 'Restart Required',
        newTranslations?.common?.restartMessage || 'The app needs to restart to apply the language changes.',
        [
          {
            text: newTranslations?.common?.restartNow || 'Restart Now',
            onPress: () => {
              RNRestart.restart();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const toggleLanguage = () => {
    const currentLanguage = i18n.language;
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };

  const getCurrentLanguage = () => i18n.language;
  
  const isRTL = () => i18n.language === 'ar';

  return {
    t,
    changeLanguage,
    toggleLanguage,
    getCurrentLanguage,
    isRTL,
    currentLanguage: i18n.language,
  };
};
