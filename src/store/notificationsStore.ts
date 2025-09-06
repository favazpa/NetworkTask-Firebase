import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, NOTIFICATION_TYPES } from '../shared/constants';

export type Notification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  isRead: boolean;
  type?: keyof typeof NOTIFICATION_TYPES;
};

type NotificationsState = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        console.log('Adding notification:', notification);
        const timestamp = Date.now();
        const newNotification: Notification = {
          ...notification,
          id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp,
          isRead: false,
        };
        
        console.log('New notification created:', newNotification);
        set({
          notifications: [newNotification, ...get().notifications],
        });
        console.log('Notification added to store. Total notifications:', get().notifications.length);
      },

      markAsRead: (notificationId) => {
        const { notifications } = get();
        set({
          notifications: notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ),
        });
      },

      markAllAsRead: () => {
        const { notifications } = get();
        set({
          notifications: notifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
        });
      },

      removeNotification: (notificationId) => {
        const { notifications } = get();
        set({
          notifications: notifications.filter(notification => notification.id !== notificationId),
        });
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.isRead).length;
      },
    }),
    {
      name: STORAGE_KEYS.NOTIFICATIONS,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
