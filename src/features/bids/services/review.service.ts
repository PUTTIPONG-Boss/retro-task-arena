import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface CreateReviewPayload {
  taskId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  qualityScore: number;
  timelinessScore: number;
  behaviorScore: number;
  pointsAwarded: number;
}

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const response = await apiClient.post('/review', payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['bids', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
