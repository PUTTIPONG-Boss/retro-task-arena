import { useEffect, useRef } from 'react';
import { Centrifuge, Subscription } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';
import { useGetQuests } from '@/features/quests/services/quest.service';

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

  const { data: quests = [] } = useGetQuests();

  const centrifugeRef = useRef<Centrifuge | null>(null);
  const subsRef = useRef<Subscription[]>([]);

  const ownedQuests = quests.filter((q) => q.providerId === user?.id);

  useEffect(() => {
    if (!isAuthenticated || ownedQuests.length === 0) return;

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
        queryClient.invalidateQueries({ queryKey: ['bids', quest.id] });
        addNotification(`⚔️ [${quest.title}] New bid arrived! ${data.bidAmount} GP`, 'bid');
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
    };
  }, [isAuthenticated, ownedQuests.length, user?.id]);
}
