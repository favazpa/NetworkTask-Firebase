import React, { useEffect } from 'react';
import RootNavigator from './navigation/RootNavigator';
import InAppNotification from './features/inapp/InAppNotification';
import useNotificationSetup from './hooks/useNotificationSetup';
import { initNotificationsOnce } from './services/notifications/notificationService';
import useChatTopic from './hooks/useChatTopics';

export default function App() {
  useNotificationSetup();
  useChatTopic();
  useEffect(() => {
    initNotificationsOnce();
  }, []);

  return (
    <>
      <RootNavigator />
      <InAppNotification />
    </>
  );
}
