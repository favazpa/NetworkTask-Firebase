import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navReady() {
  return navigationRef.isReady();
}

export function goToChat() {
  if (navigationRef.isReady()) {
    // push Chat on top so Back returns to Home
    navigationRef.navigate('Chat', { roomId: 'global' } as any);
  }
}
