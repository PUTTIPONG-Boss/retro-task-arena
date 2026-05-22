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
  getSubmissionCount: (questId: string) => number;
  markAllRead: () => void;
  clearAll: () => void;
}

// i18nKey ที่อนุญาตให้แจ้งซ้ำได้ (เช่น ส่งงานหลายครั้ง)
const REPEATABLE_KEYS = new Set(['notifications.workSubmitted', 'notifications.workSubmittedNo', 'notifications.bidRejected', 'notifications.changesRequested']);

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      // นับว่า quest นี้ถูกส่งงานมากี่ครั้งแล้วใน store
      getSubmissionCount: (questId: string) => {
        const userId = useAuthStore.getState().user?.id;
        return get().notifications.filter(
          (n) => n.userId === userId &&
                 (n.i18nKey === 'notifications.workSubmitted' || n.i18nKey === 'notifications.workSubmittedNo') &&
                 n.questId === questId
        ).length;
      },

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
        set((state) => {
          const isDuplicate = state.notifications.some((n) => {
            if (n.userId !== userId) return false;
            // ถ้า i18nKey อยู่ใน REPEATABLE_KEYS ให้แจ้งซ้ำได้เสมอ
            if (i18nKey && REPEATABLE_KEYS.has(i18nKey)) return false;
            // ถ้ามี i18nKey + questId ให้ใช้เป็น unique key โดยไม่จำกัดเวลา
            if (i18nKey && questId && n.i18nKey === i18nKey && n.questId === questId) return true;
            // fallback: เช็ค message เดิมภายใน 10 วินาที
            return (
              !n.read &&
              n.message === message &&
              (new Date().getTime() - new Date(n.timestamp).getTime()) < 10000
            );
          });
          if (isDuplicate) return state;

          return {
            notifications: [newNotif, ...state.notifications].slice(0, 100),
          };
        });
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
      merge: (persisted, current) => {
        const p = persisted as Partial<NotificationState>;
        const notifications = (p.notifications ?? [])
          .map((n) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return {
          ...current,
          ...p,
          notifications,
        };
      },
    }
  )
);