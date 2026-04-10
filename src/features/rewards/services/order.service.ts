import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CreateOrderPayload, Order, Product } from '../types';
import { useUserStore } from '@/features/users/store/userStore';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await apiClient.post('/order', payload);
      return response.data;
    },
    // ยกเลิก in-flight queries ก่อน mutation เพื่อไม่ให้ข้อมูลเก่าเขียนทับ optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['profile'] });
    },
    // service-level onSuccess ทำงานก่อน component-level callback เสมอใน TanStack Query v5
    onSuccess: (_data, payload) => {
      const totalCost = payload.orderItems.reduce(
        (sum, item) => sum + item.pricePerUnit * item.quantity,
        0
      );

      // อัปเดต Zustand userStore ทันที
      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        useUserStore.getState().setUser({
          ...currentUser,
          points: (currentUser.points ?? 0) - totalCost,
        });
      }

      // อัปเดต stock ใน React Query cache ทันที
      payload.orderItems.forEach((item) => {
        queryClient.setQueryData<Product[]>(['products'], (old) =>
          old?.map((p) =>
            p.id === item.productId
              ? { ...p, stock: p.stock - item.quantity }
              : p
          )
        );
      });
    },
    // sync กับ server หลัง optimistic update
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};

export const useGetMyOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['my-orders', userId],
    enabled: !!userId && userId !== '00000000-0000-0000-0000-000000000000',
    queryFn: async (): Promise<Order[]> => {
      const response = await apiClient.get<Order[]>(`/order/my`);
      return response.data;
    },
  });
};
