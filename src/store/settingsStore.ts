import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { STORAGE_KEYS } from '../shared/constants';
import { stopNotificationServices, reinitializeNotificationServices } from '../services/notifications/notificationService';

type SettingsState = {
  pushNotificationsEnabled: boolean;
  hasHydrated: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => Promise<void>;
  initializeSettings: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      pushNotificationsEnabled: true,
      hasHydrated: false,

      setPushNotificationsEnabled: async (enabled: boolean) => {
        console.log('Setting push notifications enabled to:', enabled);
        try {
          if (enabled) {
            console.log('Enabling push notifications...');
            // Request permission and enable notifications
            const authStatus = await messaging().requestPermission();
            console.log('Permission status:', authStatus);
            const enabledStatus =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabledStatus) {
              console.log('Permission granted, registering device...');
              // Register for remote messages and get FCM token
              await messaging().registerDeviceForRemoteMessages();
              const token = await messaging().getToken();
              console.log('Push notifications enabled, FCM token:', token);
              
              // Reinitialize notification services
              console.log('Reinitializing notification services...');
              reinitializeNotificationServices();
            } else {
              console.log('Push notification permission denied');
              set({ pushNotificationsEnabled: false });
              return;
            }
          } else {
            // Completely disable notifications
            try {
              // Stop all notification services first
              stopNotificationServices();
              
              // Delete FCM token to stop all notifications
              await messaging().deleteToken();
              console.log('FCM token deleted - all notifications stopped');
            } catch (tokenError) {
              console.log('Error deleting FCM token:', tokenError);
            }
            
            try {
              // Unregister device from remote messages
              await messaging().unregisterDeviceForRemoteMessages();
              console.log('Device unregistered from remote messages');
            } catch (unregisterError) {
              console.log('Error unregistering device:', unregisterError);
            }
          }

          set({ pushNotificationsEnabled: enabled });
        } catch (error) {
          console.error('Error toggling push notifications:', error);
        }
      },

      initializeSettings: () => {
        set({ hasHydrated: true });
      },
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            useSettingsStore.setState({ hasHydrated: true });
          } else {
            useSettingsStore.setState({ hasHydrated: true });
          }
        };
      },
    },
  ),
);
