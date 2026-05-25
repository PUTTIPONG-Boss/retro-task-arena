import { useEffect, useRef } from 'react';
import { Centrifuge } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/features/notifications/store/notificationStore';
import { useGetQuests } from '@/features/quests/services/quest.service';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import React from 'react';
import PixelCoin from '@/components/icons/PixelCoin';
import PixelInbox from '@/components/icons/PixelInbox';

function getLastSeenKey(userId: string) {
  return `owner_bid_last_seen_${userId}`;
}

function saveLastSeen(userId: string) {
  localStorage.setItem(getLastSeenKey(userId), new Date().toISOString());
}

function getLastSeen(userId: string): Date | null {
  const raw = localStorage.getItem(getLastSeenKey(userId));
  return raw ? new Date(raw) : null;
}

interface OwnerRealtimePayload {
  type: string;
  taskId: string;
  taskTitle?: string;
  bidAmount?: number;
  waitDuration?: string;
}

export function useOwnerBidNotifications() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const getSubmissionCount = useNotificationStore((s) => s.getSubmissionCount);
  const { t } = useTranslation();
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const { data: quests = [] } = useGetQuests();
  const ownedQuests = quests.filter((q) => q.providerId === user?.id);

  // --- Real-time: รับ new_bid และ work_submitted จาก Centrifugo ---
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
      const data = ctx.data as OwnerRealtimePayload;
      const t = tRef.current;

      if (data.type === 'new_bid' || data.type === 'bid') {
        const title = data.taskTitle ?? '';
        const amount = String(data.bidAmount ?? '');
        const msg = t('notifications.newBid', { title, amount });
        addNotification(msg, 'bid', 'notifications.newBid', { title, amount }, data.taskId);
        toast.info(msg, {
          icon: React.createElement(PixelCoin, { size: 18, className: 'text-yellow-400' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        queryClient.invalidateQueries({ queryKey: ['bids', data.taskId] });
      } else if (data.type === 'work_submitted') {
        const title = data.taskTitle ?? '';
        const submissionNo = getSubmissionCount(data.taskId) + 1;
        const i18nKey = submissionNo > 1 ? 'notifications.workSubmittedNo' : 'notifications.workSubmitted';
        const i18nParams: Record<string, string> = submissionNo > 1
          ? { title, no: String(submissionNo) }
          : { title };
        const msg = t(i18nKey, i18nParams);
        addNotification(msg, 'general', i18nKey, i18nParams, data.taskId);
        toast.info(msg, {
          icon: React.createElement(PixelInbox, { size: 18, color: '#60a5fa' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      }
    });

    sub.on('error', (ctx) => {
      console.warn('[OwnerBidNotify] subscription error:', ctx.error);
    });

    centrifuge.on('error', (ctx) => {
      console.warn('[OwnerBidNotify] connection error:', ctx.error);
    });

    const connectTimer = setTimeout(() => {
      centrifuge.connect();
      sub.subscribe();
    }, 100);

    return () => {
      clearTimeout(connectTimer);
      sub.unsubscribe();
      centrifuge.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  // --- Missed Bid Detection: ตรวจสอบ bid ที่พลาดไปตอน offline ---
  // (work_submitted offline จัดการโดย useLoginNotifications ผ่าน DB แล้ว)
  useEffect(() => {
    if (!isAuthenticated || !user?.id || ownedQuests.length === 0) return;

    const lastSeen = getLastSeen(user.id);
    if (!lastSeen) return;

    const t = tRef.current;

    const checkMissedBids = async () => {
      for (const quest of ownedQuests) {
        try {
          const res = await apiClient.get<{ data: any[] } | any[]>(`/tasks/${quest.id}/bids`);
          const raw = res.data;
          const bids: any[] = Array.isArray(raw) ? raw : (raw?.data ?? []);

          const missedBids = bids.filter((b: any) => {
            if (!b.createdAt) return false;
            return new Date(b.createdAt) > lastSeen;
          });

          for (const bid of missedBids) {
            const msg = t('notifications.newBid', { title: quest.title, amount: bid.bidAmount });
            addNotification(msg, 'bid', 'notifications.newBid', { title: quest.title, amount: String(bid.bidAmount) }, quest.id);
          }

          if (missedBids.length > 0) {
            queryClient.invalidateQueries({ queryKey: ['bids', quest.id] });
          }
        } catch {
          // ถ้า quest ไหน fetch ไม่สำเร็จ ข้ามไป
        }
      }
    };

    checkMissedBids();
  }, [isAuthenticated, user?.id, user?.role, ownedQuests.length]);

  // --- save lastSeen on unmount ---
  useEffect(() => {
    return () => {
      if (user?.id) {
        saveLastSeen(user.id);
      }
    };
  }, [user?.id]);
}
