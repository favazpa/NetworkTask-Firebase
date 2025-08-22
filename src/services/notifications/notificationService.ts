import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { useAuthStore } from '../../store/authStore';
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

async function showForegroundNotification(remoteMessage: any) {
  await ensureChannel();

  await notifee.displayNotification({
    title: remoteMessage?.notification?.title ?? 'New Message',
    body: remoteMessage?.notification?.body ?? '',
    data: {
      ...(remoteMessage?.data ?? {}),
      screen: 'Chat',
      roomId: remoteMessage?.data?.roomId ?? 'global',
    },
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
    },
  });
}

function handleForeground(remoteMessage: any) {
  const id = remoteMessage?.messageId;
  if (id && seen.has(id)) return;
  if (id) {
    seen.add(id);
    setTimeout(() => seen.delete(id), 60_000);
  }

  const me = useAuthStore.getState().user?.id;
  const senderId = remoteMessage?.data?.senderId;
  if (senderId && me && senderId === me) return;

  const title = remoteMessage?.notification?.title ?? 'New Message';
  const body = remoteMessage?.notification?.body ?? '';
  const data = {
    ...(remoteMessage?.data || {}),
    screen: 'Chat',
    roomId: remoteMessage?.data?.roomId ?? 'global',
  };

  showInAppNotification({
    title,
    message: body,
    icon: remoteMessage?.data?.type === 'gift' ? 'gift' : 'chat',
    durationMs: 3500,
    data,
  });
}

export function initNotificationsOnce() {
  if (started) return;
  started = true;

  const u1 = messaging().onMessage(handleForeground);

  const u2 = messaging().onNotificationOpenedApp(rm => {
    routeFromNotificationData(rm?.data);
  });

  messaging()
    .getInitialNotification()
    .then(rm => {
      if (rm) routeFromNotificationData(rm?.data);
    });

  const u3 = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      routeFromNotificationData(detail.notification?.data as any);
    }
  });

  notifee.getInitialNotification().then(initial => {
    if (initial?.notification?.data) {
      routeFromNotificationData(initial.notification.data as any);
    }
  });

  unsubs = [u1, u2, u3];
}

export function teardownNotifications() {
  unsubs.forEach(u => u());
  unsubs = [];
  started = false;
  seen.clear();
}
