import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Quest, QuestStatus, CreateQuestPayload, Bid, SubmitBidPayload } from '../types';

// The Backend Response Types
interface BackendBid {
  id: string;
  taskId: string;
  userId: string;
  username: string;
  questsCompleted: number;
  totalPointsEarned: number;
  rating: number;
  bidAmount: number;
  waitDuration: string;
  note: string;
  status: string;
  createdAt: string;
}

const mapBackendBid = (b: BackendBid): Bid => ({
  id: b.id,
  taskId: b.taskId,
  userId: b.userId,
  username: b.username,
  questsCompleted: b.questsCompleted,
  totalPointsEarned: b.totalPointsEarned,
  rating: b.rating,
  bidAmount: b.bidAmount,
  waitDuration: b.waitDuration,
  note: b.note,
  status: b.status as Bid['status'],
  createdAt: b.createdAt,
});


// The Backend Response Types
interface BackendTask {
  id: string;
  employerId: string;
  assigneeId: string | null;
  title: string;
  description: string;
  point: number;
  estimatedTime: string;
  type: string;
  skills: string;
  difficulty: string;
  gitRepoUrl: string;
  reqBranchName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  employerName: string;
}

interface FetchTasksResponse {
  message: string;
  data: BackendTask[];
}

// Convert Backend Task to Frontend Quest
const mapTaskToQuest = (task: BackendTask): Quest => {
  // Map Difficulty (Backend: 'EASY', 'MEDIUM', 'HARD') to Number (Frontend: 1-5)
  let diffLevel = 1;
  if (task.difficulty === "MEDIUM") diffLevel = 3;
  if (task.difficulty === "HARD") diffLevel = 5;

  // Map Status
  let status: Quest['status'] = "open";
  if (task.status === "IN_PROGRESS") status = "in-progress";
  if (task.status === "IN_REVIEW") status = "review";
  if (task.status === "COMPLETED") status = "completed";

  return {
    id: task.id,
    title: task.title,
    description: (task.description || "").substring(0, 100) + "...", // Short desc
    fullDescription: task.description,
    rewardPoints: task.point || 0,
    difficulty: diffLevel,
    estimatedTime: task.estimatedTime,
    category: task.type,
    status: status,
    providerId: task.employerId,
    providerName: task.employerName || "Unknown Guild Master",
    repoUrl: task.gitRepoUrl || undefined,
    branchName: task.reqBranchName || undefined,
    bids: [], // TODO: Bids not yet supported by backend API
    assignedTo: task.assigneeId || undefined,
    skills: task.skills || "General",
  };
};

export const useGetQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async (): Promise<Quest[]> => {
      const response = await apiClient.get<FetchTasksResponse>('/tasks');
      if (!response.data || !response.data.data) return [];

      // Ensure data is array before mapping (sometimes APIs return null if empty)
      const tasks = Array.isArray(response.data.data) ? response.data.data : [];
      return tasks.map(mapTaskToQuest);
    },
  });
};

export const useGetQuestById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['quest', id],
    queryFn: async (): Promise<Quest | null> => {
      if (!id) return null;
      const response = await apiClient.get<{ message: string; data: BackendTask }>(`/tasks/${id}`);
      if (!response.data?.data) return null;
      return mapTaskToQuest(response.data.data);
    },
    enabled: !!id,
  });
};

export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuestPayload) => {
      const response = await apiClient.post('/tasks', payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useUpdateQuestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: QuestStatus }) => {
      // Map frontend status to backend enum (uppercase snake_case)
      const backendStatus = status === "review" ? "IN_REVIEW" : status.toUpperCase().replace("-", "_");

      const response = await apiClient.put(`/tasks/${id}`, { status: backendStatus });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useUpdateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateQuestPayload> & { status?: string } }) => {
      const response = await apiClient.put(`/tasks/${id}`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.id] });
    },
  });
};

// --- Bidding Hooks ---

export const useGetBids = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['bids', taskId],
    queryFn: async (): Promise<Bid[]> => {
      if (!taskId) return [];
      const response = await apiClient.get<{ message: string; data: BackendBid[] | null }>(`/tasks/${taskId}/bids`);
      const data = response.data?.data;
      if (!data || !Array.isArray(data)) return [];
      return data.map(mapBackendBid);
    },
    enabled: !!taskId,
  });
};

export const useSubmitBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: SubmitBidPayload }) => {
      const response = await apiClient.post(`/tasks/${taskId}/apply`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bids', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useUpdateBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      bidId,
      payload,
    }: {
      taskId: string;
      bidId: string;
      payload: { user_id: string; bid_amount: number; wait_duration: string; note?: string };
    }) => {
      const response = await apiClient.patch(`/tasks/${taskId}/bids/${bidId}`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bids', variables.taskId] });
    },
  });
};

export const useAcceptBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, appId }: { taskId: string; appId: string }) => {
      const response = await apiClient.post(`/tasks/${taskId}/accept/${appId}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bids', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};
