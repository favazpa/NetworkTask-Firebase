import React, { useEffect } from 'react';
import RootNavigator from './navigation/RootNavigator';
import InAppNotification from './features/inapp/InAppNotification';
import useNotificationSetup from './hooks/useNotificationSetup';
import { initNotificationsOnce } from './services/notifications/notificationService';
import { useSettingsStore } from './store/settingsStore';

export default function App() {
  useNotificationSetup();
  const { pushNotificationsEnabled, hasHydrated } = useSettingsStore();
  
  useEffect(() => {
    console.log('App useEffect - hasHydrated:', hasHydrated, 'pushNotificationsEnabled:', pushNotificationsEnabled);
    // Only initialize notifications if they're enabled and settings are hydrated
    if (hasHydrated && pushNotificationsEnabled) {
      console.log('App: Initializing notifications...');
      initNotificationsOnce();
    } else if (hasHydrated && !pushNotificationsEnabled) {
      console.log('App: Notifications disabled, skipping initialization');
    }
  }, [hasHydrated, pushNotificationsEnabled]);

  return (
    <>
      <RootNavigator />
      <InAppNotification />
    </>
  );
}
