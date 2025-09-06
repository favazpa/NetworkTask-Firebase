import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { useAuthStore } from '../../store/authStore';
import { useNotificationsStore } from '../../store/notificationsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { routeFromNotificationData } from './notificationRouter';
import { showInAppNotification } from '../../features/inapp/notifyCentre';

let started = false;
let unsubs: Array<() => void> = [];
const seen = new Set<string>();

async function ensureChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default',
    importance: 4,
  });
}

function handleForeground(remoteMessage: any) {
  // Check if push notifications are enabled
  const { pushNotificationsEnabled } = useSettingsStore.getState();
  if (!pushNotificationsEnabled) {
    console.log('Push notifications disabled, ignoring message');
    return;
  }

  const id = remoteMessage?.messageId;
  if (id && seen.has(id)) return;
  if (id) {
    seen.add(id);
    setTimeout(() => seen.delete(id), 60_000);
  }

  const me = useAuthStore.getState().user?.id;
  const senderId = remoteMessage?.data?.senderId;
  if (senderId && me && senderId === me) return;

  const title = remoteMessage?.notification?.title ?? 'New Notification';
  const body = remoteMessage?.notification?.body ?? '';
  const data = {
    ...(remoteMessage?.data || {}),
    screen: 'Notifications',
  };

  // Add to notifications store with unique ID from message
  const notificationId = remoteMessage?.messageId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const notificationData = {
    ...data,
    notificationId,
  };

  useNotificationsStore.getState().addNotification({
    title,
    body,
    type: remoteMessage?.data?.type || 'general',
  });

  showInAppNotification({
    title,
    message: body,
    icon: 'info',
    durationMs: 3500,
    data: notificationData,
  });
}

function handleBackgroundNotification(remoteMessage: any) {
  // Check if push notifications are enabled
  const { pushNotificationsEnabled } = useSettingsStore.getState();
  if (!pushNotificationsEnabled) {
    console.log('Push notifications disabled, ignoring background message');
    return;
  }

  const me = useAuthStore.getState().user?.id;
  const senderId = remoteMessage?.data?.senderId;
  if (senderId && me && senderId === me) return;

  const title = remoteMessage?.notification?.title ?? 'New Notification';
  const body = remoteMessage?.notification?.body ?? '';

  // Add to notifications store for background notifications
  useNotificationsStore.getState().addNotification({
    title,
    body,
    type: remoteMessage?.data?.type || 'general',
  });
}

export function initNotificationsOnce() {
  // Check if notifications are enabled before initializing
  const { pushNotificationsEnabled } = useSettingsStore.getState();
  if (!pushNotificationsEnabled) {
    console.log('Push notifications disabled, skipping initialization');
    return;
  }

  if (started) {
    console.log('Notification services already started');
    return;
  }
  
  started = true;
  console.log('Initializing notification services...');

  // Handle foreground notifications
  const u1 = messaging().onMessage(handleForeground);

  // Handle notification opened from background
  const u2 = messaging().onNotificationOpenedApp(rm => {
    // Add to notifications store when opened from background
    if (rm?.notification) {
      handleBackgroundNotification(rm);
    }
    routeFromNotificationData(rm?.data);
  });

  // Handle initial notification (app opened from notification)
  messaging()
    .getInitialNotification()
    .then(rm => {
      if (rm?.notification) {
        handleBackgroundNotification(rm);
      }
      if (rm) routeFromNotificationData(rm?.data);
    });

  // Handle notifee foreground events
  const u3 = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      routeFromNotificationData(detail.notification?.data as any);
    }
  });

  // Handle notifee initial notification
  notifee.getInitialNotification().then(initial => {
    if (initial?.notification?.data) {
      routeFromNotificationData(initial.notification.data as any);
    }
  });

  unsubs = [u1, u2, u3];
}

// Function to completely stop all notification services
export function stopNotificationServices() {
  console.log('Stopping all notification services...');
  
  // Unsubscribe from all listeners
  unsubs.forEach(unsub => {
    try {
      unsub();
    } catch (error) {
      console.log('Error unsubscribing:', error);
    }
  });
  
  // Clear the seen set
  seen.clear();
  
  // Reset started flag
  started = false;
  
  console.log('All notification services stopped');
}

// Function to reinitialize notification services
export function reinitializeNotificationServices() {
  console.log('Reinitializing notification services...');
  
  // Stop existing services first
  stopNotificationServices();
  
  // Wait a bit then reinitialize
  setTimeout(() => {
    // Force reinitialize by resetting started flag
    started = false;
    initNotificationsOnce();
  }, 100);
}

// Function to force reinitialize (for debugging)
export function forceReinitializeNotifications() {
  console.log('Force reinitializing notifications...');
  started = false;
  initNotificationsOnce();
}
