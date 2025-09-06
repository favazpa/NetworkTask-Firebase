import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useAuthStore } from '../store/authStore';

export default function useChatTopic() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isLoggedIn) {
          await messaging().subscribeToTopic('global-chat');
          if (!cancelled) console.log('Subscribed to global-chat');
        } else {
          await messaging().unsubscribeFromTopic('global-chat');
          if (!cancelled) console.log('Unsubscribed from global-chat');
        }
      } catch (e) {
        console.log('Topic toggle error', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);
}
