import React, { useEffect, useRef } from 'react';
import { Centrifuge } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'sonner';
import { fetchUnreadNotifications, markNotificationsRead } from '@/features/auth/services/notification.service';
import PixelCheck from '@/components/icons/PixelCheck';
import PixelX from '@/components/icons/PixelX';
import PixelInbox from '@/components/icons/PixelInbox';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

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
      const t = tRef.current;

      if (data.type === 'bid_accepted') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.bidAccepted', { title });
        addNotification(msg, 'bid', 'notifications.bidAccepted', { title });
        toast.success(msg, {
          icon: React.createElement(PixelCheck, { size: 18, color: '#22c55e' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
        queryClient.invalidateQueries({ queryKey: ['bids', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else if (data.type === 'work_submitted') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.workSubmitted', { title });
        addNotification(msg, 'general', 'notifications.workSubmitted', { title });
        toast.info(msg, {
          icon: React.createElement(PixelInbox, { size: 18, color: '#60a5fa' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      } else if (data.type === 'work_approved') {
        const title = data.taskTitle ?? '';
        const points = (data as any).pointsAwarded ? ` (+${(data as any).pointsAwarded} GP)` : '';
        const msg = t('notifications.workApproved', { title, points });
        addNotification(msg, 'general', 'notifications.workApproved', { title, points });
        toast.success(msg, {
          icon: React.createElement(PixelCheck, { size: 18, color: '#22c55e' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 7000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      } else if (data.type === 'changes_requested') {
        const title = data.taskTitle ?? '';
        const comment = data.comment ? `: ${data.comment}` : '';
        const msg = t('notifications.changesRequested', { title, comment });
        addNotification(msg, 'general', 'notifications.changesRequested', { title, comment });
        toast.warning(msg, {
          icon: React.createElement(PixelX, { size: 18, color: '#ef4444' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 7000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      } else if (data.type === 'task_status' && data.toStatus) {
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
