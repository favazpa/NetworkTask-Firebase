import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');

    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
  } else {
    Alert.alert(
      'Permission denied',
      'Please enable notification permissions in settings to receive alerts.',
    );
  }
}
