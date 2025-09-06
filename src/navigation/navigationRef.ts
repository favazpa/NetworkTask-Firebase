import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navReady() {
  return navigationRef.isReady();
}

export function goToCart() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Cart');
  }
}

export function goToNotifications() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Notifications');
  }
}

export function goToSettings() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Settings');
  }
}

export function goToLanding() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Landing');
  }
}
