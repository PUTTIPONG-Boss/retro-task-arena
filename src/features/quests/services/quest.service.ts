import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Quest, QuestStatus, CreateQuestPayload, UpdateQuestPayload, Bid, SubmitBidPayload, DistributePointsPayload, CompletedTask, PortfolioTask } from '../types';

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
  teamMembers?: {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
  }[];
  createdAt: string;
  // Backend may return as camelCase or snake_case
  portfolioTasks?: {
    id: string;
    title: string;
    type: string;
    point: number;
    estimatedTime: string;
    skills: string;
  }[];
  portfolio_tasks?: {
    id: string;
    title: string;
    type: string;
    point: number;
    estimatedTime: string;
    skills: string;
  }[];
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
  teamMembers: b.teamMembers,
  createdAt: b.createdAt,
  githubUrl: '',
  requestedPoints: 0,
  estimatedTime: '',
  explanation: '',
  portfolioTasks: (b.portfolioTasks ?? b.portfolio_tasks)?.map((t: any): PortfolioTask => ({
    id: t.taskId || t.id,
    title: t.title,
    category: t.type,
    rewardPoints: t.point || 0,
    estimatedTime: t.estimatedTime || '',
    skills: t.skills || '',
    completedAt: t.completedAt,
  })),
});


// The Backend Response Types
interface BackendTask {
  id: string;
  ownerId: string;
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
  ownerName: string;
  workType?: string;
  work_type?: string; // snake_case fallback (some API responses use this)
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
    providerId: task.ownerId,
    providerName: task.ownerName || "Unknown Guild Master",
    repoUrl: task.gitRepoUrl || undefined,
    branchName: task.reqBranchName || undefined,
    bids: [], // TODO: Bids not yet supported by backend API
    assignedTo: task.assigneeId || undefined,
    skills: task.skills || "General",
    workType: task.workType || task.work_type || undefined,
    createdAt: task.createdAt,
  };
};

export const useGetQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async (): Promise<Quest[]> => {
      const response = await apiClient.get('/tasks');
      // Backend may return data as flat array or wrapped in {message, data}
      const raw = response.data;
      const tasks: BackendTask[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
      return tasks.map(mapTaskToQuest);
    },
  });
};

export const useGetQuestById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['quest', id],
    queryFn: async (): Promise<Quest | null> => {
      if (!id) return null;
      const response = await apiClient.get(`/tasks/${id}`);
      const raw = response.data;
      // Backend may return task directly or wrapped in {data: ...}
      const task: BackendTask | null = raw?.data ?? (raw?.id ? raw : null);
      if (!task) return null;
      return mapTaskToQuest(task);
    },
    enabled: !!id,
  });
};

export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuestPayload) => {
      console.log(payload);
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
    mutationFn: async ({ id, status, comment }: { id: string; status: QuestStatus; comment?: string }) => {
      // Map frontend status to backend enum (uppercase snake_case)
      const backendStatus = status === "review" ? "IN_REVIEW" : status.toUpperCase().replace("-", "_");

      const response = await apiClient.patch(`/tasks/${id}/status`, {
        status: backendStatus,
        comment: comment
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateQuestPayload }) => {
      const response = await apiClient.put(`/tasks/${id}`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['quest', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// --- Bidding Hooks ---

export const useGetBids = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['bids', taskId],
    queryFn: async (): Promise<Bid[]> => {
      if (!taskId) return [];
      const response = await apiClient.get<any>(`/tasks/${taskId}/bids`);
      const raw = response.data;
      // Handle either flat array or wrapped in {message, data}
      const bids: BackendBid[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
      console.log('[DEBUG] raw bids[0] from backend:', JSON.stringify(bids[0], null, 2)); // TODO: remove
      return bids.map(mapBackendBid);
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
      payload: SubmitBidPayload;
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
      queryClient.invalidateQueries({ queryKey: ['quest', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export interface TaskLog {
  id: string;
  taskId: string;
  fromStatus: string;
  toStatus: string;
  comment: string;
  createdBy: string;
  createdAt: string;
}

export const useGetTaskLogs = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['task_logs', taskId],
    queryFn: async (): Promise<TaskLog[]> => {
      if (!taskId) return [];
      const response = await apiClient.get(`/tasks/${taskId}/logs`);
      return response.data?.data || [];
    },
    enabled: !!taskId,
  });
};

export const useGetMyTasks = () => {
  return useQuery({
    queryKey: ['my-tasks'],
    queryFn: async (): Promise<Quest[]> => {
      const response = await apiClient.get('/user/tasks');
      const raw = response.data;
      const tasks: BackendTask[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
      return tasks.map(mapTaskToQuest);
    },
  });
};

export const useDistributePoints = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: DistributePointsPayload }) => {
      const response = await apiClient.post(`/tasks/${taskId}/distribute-points`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quest', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['bids', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * ดึง task ที่ user ทำเสร็จแล้ว (status=completed) เพื่อใช้แนบเป็น portfolio ตอน bid
 * GET /api/v1/user/tasks?status=completed
 */
export const useGetCompletedUserTasks = () => {
  return useQuery({
    queryKey: ['user-tasks-completed'],
    queryFn: async (): Promise<CompletedTask[]> => {
      const response = await apiClient.get('/user/tasks', {
        params: { status: 'completed' },
      });
      const raw = response.data;
      const tasks: BackendTask[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
      return tasks.map((task) => ({
        id: task.id,
        title: task.title,
        category: task.type,
        rewardPoints: task.point || 0,
        estimatedTime: task.estimatedTime,
        skills: task.skills || '',
        completedAt: task.updatedAt,
      }));
    },
  });
};

export const useDeleteQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};