import { useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { checkNotifications } from 'react-native-permissions';
import { initNotificationsOnce } from '../services/notifications/notificationService';

export default function useNotificationSetup() {
  useEffect(() => {
    const checkAndRequest = async () => {
      const { status } = await checkNotifications();
      console.log('🔍 Current permission status:', status);

      if (status === 'blocked') {
        Alert.alert(
          'Notifications Blocked',
          'Please enable push notifications from system settings.',
        );
        return;
      }

      // Ask Firebase for permission (iOS shows system prompt when needed)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        console.log('❌ Permission denied');
        return;
      }

      // Android 13+ runtime permission
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'This app needs notification permissions to keep you updated.',
            buttonPositive: 'Allow',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('🚫 Android notification permission denied');
          return;
        }
      }

      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);
      initNotificationsOnce();
    };

    checkAndRequest();
  }, []);
}
