import React, { useEffect, useRef } from 'react';
import { Centrifuge } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';
import { toast } from 'sonner';
import { fetchUnreadNotifications, markNotificationsRead } from '@/features/auth/services/notification.service';
import { getMyBids, MyBid } from '@/features/finance/services/application.service';
import { useGetQuests } from '@/features/quests/services/quest.service';
import PixelCheck from '@/components/icons/PixelCheck';
import PixelX from '@/components/icons/PixelX';
import PixelInbox from '@/components/icons/PixelInbox';
import { useTranslation } from 'react-i18next';

// --- Bid Snapshot Helpers ---
function getBidSnapshotKey(userId: string) {
  return `bid_status_snapshot_${userId}`;
}

type BidSnapshot = Record<string, 'PENDING' | 'ACCEPTED' | 'REJECTED'>;

function saveBidSnapshot(userId: string, bids: MyBid[]) {
  const snapshot: BidSnapshot = {};
  bids.forEach((b) => { snapshot[b.id] = b.status; });
  localStorage.setItem(getBidSnapshotKey(userId), JSON.stringify(snapshot));
}

function getBidSnapshot(userId: string): BidSnapshot | null {
  try {
    const raw = localStorage.getItem(getBidSnapshotKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// --- Assigned Quest Status Snapshot Helpers ---
function getAssignedQuestSnapshotKey(userId: string) {
  return `assignee_quest_status_snapshot_${userId}`;
}

type AssignedQuestSnapshot = Record<string, { status: string; title: string }>; // questId → { status, title }

function saveAssignedQuestSnapshot(userId: string, quests: { id: string; status: string; title: string }[]) {
  const snapshot: AssignedQuestSnapshot = {};
  quests.forEach((q) => { snapshot[q.id] = { status: q.status, title: q.title }; });
  localStorage.setItem(getAssignedQuestSnapshotKey(userId), JSON.stringify(snapshot));
}

function getAssignedQuestSnapshot(userId: string): AssignedQuestSnapshot | null {
  try {
    const raw = localStorage.getItem(getAssignedQuestSnapshotKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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

  const { data: allQuests = [] } = useGetQuests();
  const assignedQuests = allQuests.filter((q) => q.assignedTo === user?.id);

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

  // --- Missed Bid Accept Detection: ตรวจสอบ bid ที่ถูก accept ตอน offline ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const snapshot = getBidSnapshot(user.id);
    if (!snapshot) return; // login ครั้งแรก ยังไม่มี snapshot

    const t = tRef.current;

    getMyBids()
      .then((currentBids) => {
        for (const bid of currentBids) {
          const previousStatus = snapshot[bid.id];
          // เจอ bid ที่เคย PENDING แล้วตอนนี้เป็น ACCEPTED → พลาด notification ไป
          if (previousStatus === 'PENDING' && bid.status === 'ACCEPTED') {
            const msg = t('notifications.bidAccepted', { title: bid.taskTitle });
            addNotification(msg, 'bid', 'notifications.bidAccepted', { title: bid.taskTitle }, bid.taskId);
          }
        }
        // อัปเดต snapshot ด้วย status ปัจจุบัน
        saveBidSnapshot(user.id!, currentBids);
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
      })
      .catch(() => {});
  }, [isAuthenticated, user?.id]);

  // --- Missed Approve/Changes Requested Detection: ตรวจ quest ที่ถูก approve หรือ reject ตอน offline ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id || assignedQuests.length === 0) return;

    const snapshot = getAssignedQuestSnapshot(user.id);
    if (!snapshot) {
      // ยังไม่มี snapshot → สร้างทันที แล้วรอ login ครั้งหน้า
      saveAssignedQuestSnapshot(user.id, assignedQuests);
      return;
    }

    const t = tRef.current;

    for (const quest of assignedQuests) {
      const prev = snapshot[quest.id];
      if (!prev) continue;

      // review → completed = งานถูก approve
      if (prev.status === 'review' && quest.status === 'completed') {
        const msg = t('notifications.workApproved', { title: quest.title, points: '' });
        addNotification(msg, 'general', 'notifications.workApproved', { title: quest.title, points: '' }, quest.id);
      }

      // review → in-progress = employer ส่งกลับมาแก้
      if (prev.status === 'review' && quest.status === 'in-progress') {
        const msg = t('notifications.changesRequested', { title: quest.title, comment: '' });
        addNotification(msg, 'general', 'notifications.changesRequested', { title: quest.title, comment: '' }, quest.id);
      }
    }

    // อัปเดต snapshot ด้วย status ล่าสุด
    saveAssignedQuestSnapshot(user.id, assignedQuests);
    queryClient.invalidateQueries({ queryKey: ['quests'] });
  }, [isAuthenticated, user?.id, assignedQuests.length]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const centrifuge = new Centrifuge('ws://localhost:8000/connection/websocket', {
      getToken: async () => {
        const res = await apiClient.get<{ token: string }>('/centrifugo/token');
        return res.data.token;
      },
    });

    // บันทึก snapshot ล่าสุดตอน connect สำเร็จ เพื่อให้ตรวจ offline changes ได้แม่นยำ
    centrifuge.on('connected', () => {
      getMyBids()
        .then((bids) => saveBidSnapshot(user.id!, bids))
        .catch(() => {});
      if (assignedQuests.length > 0) {
        saveAssignedQuestSnapshot(user.id!, assignedQuests);
      }
    });

    const channel = `user:${user.id}_notifications`;
    const sub = centrifuge.newSubscription(channel);

    sub.on('publication', (ctx) => {
      const data = ctx.data as TaskStatusPayload;
      const t = tRef.current;

      if (data.type === 'bid_accepted') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.bidAccepted', { title });
        addNotification(msg, 'bid', 'notifications.bidAccepted', { title }, data.taskId);
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
        // อัปเดต snapshot ทันทีที่รับ event จริง เพื่อไม่ให้แจ้งซ้ำตอน login ครั้งถัดไป
        if (data.bidId) {
          const snapshot = getBidSnapshot(user.id!) ?? {};
          snapshot[data.bidId] = 'ACCEPTED';
          localStorage.setItem(getBidSnapshotKey(user.id!), JSON.stringify(snapshot));
        }
      } else if (data.type === 'work_submitted') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.workSubmitted', { title });
        addNotification(msg, 'general', 'notifications.workSubmitted', { title }, data.taskId);
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
        addNotification(msg, 'general', 'notifications.workApproved', { title, points }, data.taskId);
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
        addNotification(msg, 'general', 'notifications.changesRequested', { title, comment }, data.taskId);
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
      // บันทึก snapshot ล่าสุดก่อน disconnect เพื่อใช้ตรวจ missed bids ครั้งถัดไป
      getMyBids()
        .then((bids) => saveBidSnapshot(user.id!, bids))
        .catch(() => {});
      if (assignedQuests.length > 0) {
        saveAssignedQuestSnapshot(user.id!, assignedQuests);
      }
    };
  }, [isAuthenticated, user?.id]);
}
