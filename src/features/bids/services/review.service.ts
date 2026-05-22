import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface Review {
  id: string;
  taskId: string;
  rating: number;
  comment: string;
  qualityScore: number;
  timelinessScore: number;
  behaviorScore: number;
  isPublished: boolean;
  createdAt: string;
  isPointDistributed?: boolean;
}

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

export const useGetReviewsByTaskId = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['reviews', taskId],
    queryFn: async (): Promise<Review[]> => {
      if (!taskId) return [];
      const response = await apiClient.get(`/review/task/${taskId}`);
      return response.data;
    },
    enabled: !!taskId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      // Map frontend camelCase to backend snake_case
      const backendPayload = {
        task_id: payload.taskId,
        reviewee_id: payload.revieweeId,
        rating: payload.rating,
        comment: payload.comment,
        quality_score: payload.qualityScore,
        timeliness_score: payload.timelinessScore,
        behavior_score: payload.behaviorScore,
        points_awarded: payload.pointsAwarded,
      };

      const response = await apiClient.post('/review', backendPayload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['bids', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
