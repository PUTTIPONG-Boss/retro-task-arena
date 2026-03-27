import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CreateOrderPayload, Order } from '../types';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const response = await apiClient.post('/order', payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate products to update stock levels in the UI
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Invalidate profile to update the user's point balance
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Invalidate orders
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
};

export const useGetMyOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['my-orders', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Order[]> => {
      const response = await apiClient.get<Order[]>(`/order/user/${userId}`);
      return response.data;
    },
  });
};
