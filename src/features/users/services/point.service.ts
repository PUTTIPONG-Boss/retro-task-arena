import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export const useGetUnseenPoints = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['unseenPoints'],
    queryFn: async () => {
      const response = await apiClient.get('/point/unseen');
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarkPointsAsSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/point/mark-seen');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unseenPoints'] });
    },
  });
};
