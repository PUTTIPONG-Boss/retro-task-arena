import { useEffect } from 'react';
import { Centrifuge } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'sonner';
import { fetchUnreadNotifications, markNotificationsRead } from '@/features/auth/services/notification.service';

interface TaskStatusPayload {
  type: string;
  taskId: string;
  bidId?: string;
  taskTitle?: string;
  fromStatus?: string;
  toStatus?: string;
  comment?: string;
}

export function useUserNotifications() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationStore((s) => s.addNotification);

  // Fetch missed notifications from backend when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    fetchUnreadNotifications()
      .then((notifs) => {
        if (notifs.length === 0) return;
        notifs.forEach((n) => addNotification(n.message, n.type));
        // Mark them as read on backend so they don't show again on next login
        markNotificationsRead().catch(() => {});
      })
      .catch(() => {});
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const centrifuge = new Centrifuge('ws://localhost:8000/connection/websocket', {
      getToken: async () => {
        const res = await apiClient.get<{ token: string }>('/centrifugo/token');
        return res.data.token;
      },
    });

    const channel = `user:${user.id}_notifications`;
    const sub = centrifuge.newSubscription(channel);

    sub.on('publication', (ctx) => {
      const data = ctx.data as TaskStatusPayload;

      if (data.type === 'bid_accepted') {
        const title = data.taskTitle ? `[${data.taskTitle}] ` : '';
        const msg = `🎉 ${title}Your bid has been accepted!`;
        addNotification(msg, 'bid');
        toast.success(msg, {
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
        queryClient.invalidateQueries({ queryKey: ['bids', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else if (data.type === 'task_status' && data.toStatus) {
        const title = data.taskTitle ? `[${data.taskTitle}] ` : '';
        const msg = `📋 ${title}Status changed to ${data.toStatus}`;
        addNotification(msg, 'general');
        toast.info(msg, {
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      }
    });

    sub.on('error', (ctx) => {
      console.warn('[UserNotify] subscription error:', ctx.error);
    });

    centrifuge.on('error', (ctx) => {
      console.warn('[UserNotify] connection error:', ctx.error);
    });

    centrifuge.connect();
    sub.subscribe();

    return () => {
      sub.unsubscribe();
      centrifuge.disconnect();
    };
  }, [isAuthenticated, user?.id]);
}
