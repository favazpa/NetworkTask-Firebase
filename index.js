/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background FCM Message:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
