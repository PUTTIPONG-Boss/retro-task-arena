import { useEffect, useRef } from 'react';
import { Centrifuge, Subscription } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';
import { useGetQuests } from '@/features/quests/services/quest.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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

// --- Quest Status Snapshot Helpers ---
function getQuestSnapshotKey(userId: string) {
  return `owner_quest_status_snapshot_${userId}`;
}

type QuestSnapshot = Record<string, string>; // questId → status

function saveQuestSnapshot(userId: string, ownedQuests: { id: string; status: string }[]) {
  const snapshot: QuestSnapshot = {};
  ownedQuests.forEach((q) => { snapshot[q.id] = q.status; });
  localStorage.setItem(getQuestSnapshotKey(userId), JSON.stringify(snapshot));
}

function getQuestSnapshot(userId: string): QuestSnapshot | null {
  try {
    const raw = localStorage.getItem(getQuestSnapshotKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface NewBidPayload {
  taskId: string;
  userId: string;
  bidAmount: number;
  waitDuration: string;
  note: string;
}

export function useOwnerBidNotifications() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const { t } = useTranslation();
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const { data: quests = [] } = useGetQuests();

  const centrifugeRef = useRef<Centrifuge | null>(null);
  const subsRef = useRef<Subscription[]>([]);

  const ownedQuests = quests.filter((q) => q.providerId === user?.id);

  // --- Missed Bid Detection: ตรวจสอบ bid ที่พลาดไปตอน offline ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id || user.role === 'ADMIN' || ownedQuests.length === 0) return;

    const lastSeen = getLastSeen(user.id);
    if (!lastSeen) return; // login ครั้งแรก ยังไม่มีประวัติ ไม่ต้องเช็ค

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
          // ถ้า quest ไหน fetch ไม่สำเร็จ ข้ามไป ไม่หยุดทั้งหมด
        }
      }
    };

    checkMissedBids();
  }, [isAuthenticated, user?.id, user?.role, ownedQuests.length]);

  // --- Missed Work Submit Detection: ตรวจสอบ quest ที่มีคน submit งานตอน offline ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id || user.role === 'ADMIN' || ownedQuests.length === 0) return;

    const snapshot = getQuestSnapshot(user.id);
    if (!snapshot) {
      // ยังไม่มี snapshot → สร้างทันที แล้วรอ login ครั้งหน้า
      saveQuestSnapshot(user.id, ownedQuests);
      return;
    }

    const t = tRef.current;

    for (const quest of ownedQuests) {
      const previousStatus = snapshot[quest.id];
      // in-progress → review = มีคน submit งานมาตอนที่เรา offline
      if (previousStatus === 'in-progress' && quest.status === 'review') {
        const msg = t('notifications.workSubmitted', { title: quest.title });
        // addNotification(msg, 'general', 'notifications.workSubmitted', { title: quest.title }, quest.id);
      }
    }

    // อัปเดต snapshot ด้วย status ล่าสุด
    saveQuestSnapshot(user.id, ownedQuests);
    queryClient.invalidateQueries({ queryKey: ['quests'] });
  }, [isAuthenticated, user?.id, user?.role, ownedQuests.length]);

  // --- WebSocket: รับ bid แบบ real-time ---
  useEffect(() => {
    if (!isAuthenticated || !user?.id || user.role === 'ADMIN' || ownedQuests.length === 0) return;

    const centrifuge = new Centrifuge('ws://localhost:8000/connection/websocket', {
      getToken: async () => {
        const res = await apiClient.get<{ token: string }>('/centrifugo/token');
        return res.data.token;
      },
    });

    centrifugeRef.current = centrifuge;

    const subs: Subscription[] = ownedQuests.map((quest) => {
      const channel = `bids:task_${quest.id}`;
      const sub = centrifuge.newSubscription(channel);

      sub.on('publication', (ctx) => {
        const data = ctx.data as NewBidPayload;
        const t = tRef.current;
        queryClient.invalidateQueries({ queryKey: ['bids', quest.id] });
        const msg = t('notifications.newBid', { title: quest.title, amount: data.bidAmount });
        addNotification(msg, 'bid', 'notifications.newBid', { title: String(data.bidAmount) }, quest.id);
        toast.info(msg, {
          style: { fontFamily: '"TA_8bit"', fontSize: '16px' },
          duration: 6000,
        });
      });

      sub.on('error', (ctx) => {
        console.warn(`[BidNotify] subscription error on ${channel}:`, ctx.error);
      });

      sub.subscribe();
      return sub;
    });

    subsRef.current = subs;

    centrifuge.on('error', (ctx) => {
      console.warn('[BidNotify] connection error:', ctx.error);
    });

    centrifuge.connect();

    return () => {
      subs.forEach((sub) => sub.unsubscribe());
      centrifuge.disconnect();
      centrifugeRef.current = null;
      subsRef.current = [];
      // บันทึกเวลา disconnect ล่าสุด เพื่อใช้ตรวจสอบ missed bids ครั้งถัดไป
      if (user?.id) {
        saveLastSeen(user.id);
        saveQuestSnapshot(user.id, ownedQuests);
      }
    };
  }, [isAuthenticated, ownedQuests.length, user?.id, user?.role]);
}
