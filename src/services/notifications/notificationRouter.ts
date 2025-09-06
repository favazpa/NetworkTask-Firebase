import { goToNotifications, goToCart } from '../../navigation/navigationRef';

type NotiData = {
  screen?: string;
  type?: string;
  notificationId?: string;
};

export function routeFromNotificationData(data?: NotiData | null) {
  if (!data) return;

  // If there's a specific notification ID, mark it as read
  if (data.notificationId) {
    const { markAsRead } = require('../../store/notificationsStore').useNotificationsStore.getState();
    markAsRead(data.notificationId);
  }

  if (data.screen === 'Notifications') {
    return goToNotifications();
  }

  if (data.screen === 'Cart') {
    return goToCart();
  }

  // Default to notifications screen for all notifications
  return goToNotifications();
}
