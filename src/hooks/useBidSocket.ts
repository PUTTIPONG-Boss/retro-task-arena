import { useEffect } from 'react';
import { Centrifuge } from 'centrifuge';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface NewBidPayload {
  taskId: string;
  userId: string;
  bidAmount: number;
  waitDuration: string;
  note: string;
}

export function useBidSocket(taskId: string | undefined, isOwner: boolean, title: string) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

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

        queryClient.invalidateQueries({ queryKey: ['bids', taskId] });

        // แสดง toast เฉพาะฝั่งเจ้าของ quest เท่านั้น (ไม่ใช่คนที่เพิ่งกด bid เอง)
        if (isOwner && data.userId !== user?.id) {
          toast.info(`New bid arrived! ${data.bidAmount} GP`);
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