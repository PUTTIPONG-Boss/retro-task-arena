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
import PixelCoin from '@/components/icons/PixelCoin';
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

// --- Member Task Snapshot Helpers ---
function getMemberTaskSnapshotKey(userId: string) {
  return `member_task_status_snapshot_${userId}`;
}

type MemberTaskSnapshot = Record<string, { status: string; title: string }>;

function saveMemberTaskSnapshot(userId: string, tasks: { id: string; status: string; title: string }[]) {
  const snapshot: MemberTaskSnapshot = {};
  tasks.forEach((t) => { snapshot[t.id] = { status: t.status, title: t.title }; });
  localStorage.setItem(getMemberTaskSnapshotKey(userId), JSON.stringify(snapshot));
}

function getMemberTaskSnapshot(userId: string): MemberTaskSnapshot | null {
  try {
    const raw = localStorage.getItem(getMemberTaskSnapshotKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function getMyMemberTasks(): Promise<{ id: string; status: string; title: string }[]> {
  try {
    const { apiClient } = await import('@/lib/api');
    const res = await apiClient.get<{ id: string; status: string; title: string }[]>('/tasks/member-tasks');
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
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
  bidAmount?: number;
  waitDuration?: string;
}

export function useUserNotifications() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const getSubmissionCount = useNotificationStore((s) => s.getSubmissionCount);
  const { t } = useTranslation();
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const { data: allQuests = [] } = useGetQuests();
  const assignedQuests = allQuests.filter((q) => q.assignedTo === user?.id);

  // Fetch missed notifications from backend when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const lastFetchKey = `noti_last_fetched_${user.id}`;
    const lastFetched = localStorage.getItem(lastFetchKey);
    const lastFetchedDate = lastFetched ? new Date(lastFetched) : null;

    fetchUnreadNotifications()
      .then((notifs) => {
        // filter เฉพาะ notification ที่ใหม่กว่าครั้งที่ fetch ล่าสุด
        const newNotifs = lastFetchedDate
          ? notifs.filter((n) => new Date(n.timestamp) > lastFetchedDate)
          : notifs;

        if (newNotifs.length > 0) {
          // เรียงจากเก่าสุดไปใหม่สุด เพื่อให้นับ submission count ถูกต้อง
          const sorted = [...newNotifs].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          sorted.forEach((n) => {
            if (
              n.i18nKey === 'notifications.workSubmitted' ||
              n.i18nKey === 'notifications.workSubmittedNo'
            ) {
              const submissionNo = getSubmissionCount(n.questId ?? '') + 1;
              const i18nKey = submissionNo > 1 ? 'notifications.workSubmittedNo' : 'notifications.workSubmitted';
              const i18nParams: Record<string, string> = submissionNo > 1
                ? { title: n.i18nParams?.title ?? '', no: String(submissionNo) }
                : { title: n.i18nParams?.title ?? '' };
              const msg = i18nParams.title
                ? n.message.replace(n.i18nParams?.title ?? '', i18nParams.title)
                : n.message;
              addNotification(msg, n.type, i18nKey, i18nParams, n.questId);
            } else {
              addNotification(n.message, n.type, n.i18nKey, n.i18nParams, n.questId);
            }
          });
        }

        // บันทึกเวลา fetch ล่าสุด (ใช้ timestamp ใหม่สุดใน notifs ทั้งหมด)
        const latest = notifs.reduce<Date | null>((max, n) => {
          const t = new Date(n.timestamp);
          return max === null || t > max ? t : max;
        }, null);
        if (latest) {
          localStorage.setItem(lastFetchKey, latest.toISOString());
        } else {
          // ไม่มี notification เลย → บันทึกเวลาตอนนี้เพื่อไม่ให้ fetch ซ้ำ
          localStorage.setItem(lastFetchKey, new Date().toISOString());
        }

        // Mark them as read on backend
        markNotificationsRead().catch(() => { });
      })
      .catch(() => { });
  }, [isAuthenticated, user?.id, user?.role]);

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
          // เจอ bid ที่เคย PENDING แล้วตอนนี้เป็น REJECTED → พลาด notification ไป
          if (previousStatus === 'PENDING' && bid.status === 'REJECTED') {
            const msg = t('notifications.bidRejected', { title: bid.taskTitle });
            addNotification(msg, 'bid', 'notifications.bidRejected', { title: bid.taskTitle }, bid.taskId);
          }
        }
        // อัปเดต snapshot ด้วย status ปัจจุบัน
        saveBidSnapshot(user.id!, currentBids);
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
      })
      .catch(() => { });
  }, [isAuthenticated, user?.id, user?.role]);

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
  }, [isAuthenticated, user?.id, user?.role, assignedQuests.length]);

  // --- Missed Approve/Completion Detection for Team Members (offline) ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const snapshot = getMemberTaskSnapshot(user.id);
    if (!snapshot) return;

    const t = tRef.current;

    getMyMemberTasks().then((currentTasks) => {
      if (currentTasks.length === 0) return;

      for (const task of currentTasks) {
        const prev = snapshot[task.id];
        if (!prev) continue;

        // review → completed = งานทีมถูก approve ตอน offline
        if (prev.status === 'review' && task.status === 'completed') {
          const msg = t('notifications.workApproved', { title: task.title });
          addNotification(msg, 'general', 'notifications.workApproved', { title: task.title }, task.id);
        }

        // review → in-progress = employer ส่งกลับมาแก้ ตอน offline
        if (prev.status === 'review' && task.status === 'in-progress') {
          const msg = t('notifications.changesRequested', { title: task.title, comment: '' });
          addNotification(msg, 'general', 'notifications.changesRequested', { title: task.title, comment: '' }, task.id);
        }
      }

      saveMemberTaskSnapshot(user.id!, currentTasks);
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    }).catch(() => {});
  }, [isAuthenticated, user?.id, user?.role]);

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
        .catch(() => { });
      if (assignedQuests.length > 0) {
        saveAssignedQuestSnapshot(user.id!, assignedQuests);
      }
      // บันทึก snapshot สำหรับ task ที่ user เป็น team member
      getMyMemberTasks().then((tasks) => {
        if (tasks.length > 0) saveMemberTaskSnapshot(user.id!, tasks);
      }).catch(() => {});
    });

    const channel = `user:${user.id}_notifications`;
    const sub = centrifuge.newSubscription(channel);

    sub.on('publication', (ctx) => {
      const data = ctx.data as TaskStatusPayload;
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
      } else if (data.type === 'bid_accepted') {
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
      } else if (data.type === 'bid_rejected') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.bidRejected', { title });
        addNotification(msg, 'bid', 'notifications.bidRejected', { title }, data.taskId);
        toast.error(msg, {
          icon: React.createElement(PixelX, { size: 18, color: '#ef4444' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
        queryClient.invalidateQueries({ queryKey: ['bids', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        if (data.bidId) {
          const snapshot = getBidSnapshot(user.id!) ?? {};
          snapshot[data.bidId] = 'REJECTED';
          localStorage.setItem(getBidSnapshotKey(user.id!), JSON.stringify(snapshot));
        }
      } else if (data.type === 'work_submitted') {
        // work_submitted notification handled by useOwnerBidNotifications to avoid duplicates
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
      } else if (data.type === 'work_approved') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.workApproved', { title });
        addNotification(msg, 'general', 'notifications.workApproved', { title }, data.taskId);
        toast.success(msg, {
          icon: React.createElement(PixelCheck, { size: 18, color: '#22c55e' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 7000,
        });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quests'] });
        queryClient.invalidateQueries({ queryKey: ['myBids'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        // อัปเดต member task snapshot ทันที เพื่อไม่ให้แจ้งซ้ำตอน login ครั้งถัดไป
        getMyMemberTasks().then((tasks) => {
          if (tasks.length > 0) saveMemberTaskSnapshot(user.id!, tasks);
        }).catch(() => {});
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
      } else if (data.type === 'team_added' || data.type === 'added_to_bid' || data.type === 'team_bid_invited') {
        const title = data.taskTitle ?? '';
        const msg = t('notifications.teamAdded', { title });
        addNotification(msg, 'bid', 'notifications.teamAdded', { title }, data.taskId);
        toast.info(msg, {
          icon: React.createElement(PixelCheck, { size: 18, color: '#60a5fa' }),
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ['bids', data.taskId] });
        queryClient.invalidateQueries({ queryKey: ['quest', data.taskId] });
      } else if (data.type === 'task_status' && data.toStatus) {
        // Just invalidate queries, don't add to notification list
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

    const connectTimer = setTimeout(() => {
      centrifuge.connect();
      sub.subscribe();
    }, 100);

    return () => {
      clearTimeout(connectTimer);
      sub.unsubscribe();
      centrifuge.disconnect();
      // บันทึก snapshot ล่าสุดก่อน disconnect เพื่อใช้ตรวจ missed bids ครั้งถัดไป
      getMyBids()
        .then((bids) => saveBidSnapshot(user.id!, bids))
        .catch(() => { });
      if (assignedQuests.length > 0) {
        saveAssignedQuestSnapshot(user.id!, assignedQuests);
      }
      // บันทึก member task snapshot ก่อน disconnect
      getMyMemberTasks().then((tasks) => {
        if (tasks.length > 0) saveMemberTaskSnapshot(user.id!, tasks);
      }).catch(() => {});
    };
  }, [isAuthenticated, user?.id, user?.role]);
}