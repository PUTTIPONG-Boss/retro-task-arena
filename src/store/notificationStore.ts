import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  message: string;
  i18nKey?: string;
  i18nParams?: Record<string, string>;
  timestamp: Date;
  read: boolean;
  type: 'bid' | 'general';
  questId?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (message: string, type?: AppNotification['type'], i18nKey?: string, i18nParams?: Record<string, string>, questId?: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (message, type = 'general', i18nKey, i18nParams, questId) => {
        const newNotif: AppNotification = {
          id: crypto.randomUUID(),
          message,
          i18nKey,
          i18nParams,
          timestamp: new Date(),
          read: false,
          type,
          questId,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notification-storage-v2',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
      // timestamp ถูก serialize เป็น string ใน JSON ต้อง deserialize กลับเป็น Date
      merge: (persisted, current) => {
        const p = persisted as Partial<NotificationState>;
        return {
          ...current,
          ...p,
          notifications: (p.notifications ?? []).map((n) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })),
        };
      },
    }
  )
);
