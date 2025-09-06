import { useNotificationsStore } from '../../store/notificationsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { showInAppNotification } from '../../features/inapp/notifyCentre';

// Test function to simulate push notifications
export function sendTestNotification() {
  console.log('sendTestNotification called');
  const { addNotification } = useNotificationsStore.getState();
  const { pushNotificationsEnabled } = useSettingsStore.getState();
  
  console.log('Push notifications enabled:', pushNotificationsEnabled);
  
  // Check if push notifications are enabled
  if (!pushNotificationsEnabled) {
    console.log('Push notifications disabled, test notification not sent');
    return;
  }
  
  const testNotifications = [
    {
      title: '🎉 Special Offer!',
      body: 'Get 50% off on all electronics. Limited time offer!',
      type: 'promotion' as const,
    },
    {
      title: '📦 Order Update',
      body: 'Your order #12345 has been shipped and will arrive in 2-3 days.',
      type: 'order' as const,
    },
    {
      title: '🛍️ New Products',
      body: 'Check out our latest collection of smartphones and accessories.',
      type: 'general' as const,
    },
    {
      title: '💳 Payment Confirmed',
      body: 'Your payment of $299.99 has been processed successfully.',
      type: 'info' as const,
    },
  ];

  const randomNotification = testNotifications[Math.floor(Math.random() * testNotifications.length)];
  
  // Add to notifications store
  addNotification(randomNotification);
  
  // Show as in-app notification
  showInAppNotification({
    title: randomNotification.title,
    message: randomNotification.body,
    icon: 'info',
    durationMs: 4000,
    data: {
      screen: 'Notifications',
      type: randomNotification.type,
    },
  });
  
  console.log('Test notification sent:', randomNotification.title);
}

// Function to send multiple test notifications
export function sendMultipleTestNotifications(count: number = 3) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      sendTestNotification();
    }, i * 1000); // Send one every second
  }
}
