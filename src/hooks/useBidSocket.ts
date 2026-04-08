import { useEffect } from 'react';
import { Centrifuge } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { useNotificationStore } from '@/store/notificationStore';

interface NewBidPayload {
  taskId: string;
  userId: string;
  bidAmount: number;
  waitDuration: string;
  note: string;
}

export function useBidSocket(taskId: string | undefined, isOwner: boolean, questTitle?: string) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!taskId || !isAuthenticated) return;

    const centrifuge = new Centrifuge('ws://localhost:8000/connection/websocket', {
      getToken: async () => {
        const res = await apiClient.get<{ token: string }>('/centrifugo/token');
        return res.data.token;
      }
    });

    const channel = `bids:task_${taskId}`;
    const sub = centrifuge.newSubscription(channel);

    sub.on('publication', (ctx) => {
        const data = ctx.data as NewBidPayload;
        console.log("🔔 ข้อมูลมาถึงแล้ว!:", data);

        queryClient.invalidateQueries({ queryKey: ['bids', taskId] });

        if (isOwner) {
          const title = questTitle ? `[${questTitle}] ` : '';
          addNotification(`⚔️ ${title}New bid arrived! ${data.bidAmount} GP`, 'bid');
        }
    });

    sub.on('error', (ctx) => {
      console.warn('[BidSocket] subscription error:', ctx.error);
    });

    centrifuge.on('error', (ctx) => {
      console.warn('[BidSocket] connection error:', ctx.error);
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
  }, [taskId, isAuthenticated, isOwner, queryClient]);
}