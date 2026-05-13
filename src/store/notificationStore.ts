import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from '@/features/auth/store/authStore';

export interface AppNotification {
  id: string;
  userId?: string;
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
  addNotification: (message: string, type?: AppNotification['type'], i18nKey?: string, i18nParams?: Record<string, string>, questId?: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (message, type = 'general', i18nKey, i18nParams, questId) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        const newNotif: AppNotification = {
          id: crypto.randomUUID(),
          userId,
          message,
          i18nKey,
          i18nParams,
          timestamp: new Date(),
          read: false,
          type,
          questId,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications].slice(0, 100),
        }));
      },

      markAllRead: () => {
        const userId = useAuthStore.getState().user?.id;
        set((state) => ({
          notifications: state.notifications.map((n) => 
            (!n.userId || n.userId === userId) ? { ...n, read: true, userId: n.userId || userId } : n
          ),
        }));
      },

      clearAll: () => {
        const userId = useAuthStore.getState().user?.id;
        set((state) => ({ 
          notifications: state.notifications.filter(n => n.userId && n.userId !== userId) 
        }));
      },
    }),
    {
      name: 'notification-storage-v2',
      partialize: (state) => ({
        notifications: state.notifications,
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
