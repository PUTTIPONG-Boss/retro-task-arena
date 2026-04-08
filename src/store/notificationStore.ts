import { create } from 'zustand';

export interface AppNotification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'bid' | 'general';
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (message: string, type?: AppNotification['type']) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (message, type = 'general') => {
    const newNotif: AppNotification = {
      id: crypto.randomUUID(),
      message,
      timestamp: new Date(),
      read: false,
      type,
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
}));
