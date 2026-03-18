import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Quest, QuestStatus, CreateQuestPayload } from '../types';

// The Backend Response Types
interface BackendTask {
  ID: string;
  EmployerID: string;
  AssigneeID: string | null;
  Title: string;
  Description: string;
  Point: number;
  EstimatedTime: string;
  Type: string;
  Skills: string;
  Difficulty: string;
  GitRepoUrl: string;
  ReqBranchName: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  EmployerName: string;
}

interface FetchTasksResponse {
  message: string;
  data: BackendTask[];
}

// Convert Backend Task to Frontend Quest
const mapTaskToQuest = (task: BackendTask): Quest => {
  // Map Difficulty (Backend: 'EASY', 'MEDIUM', 'HARD') to Number (Frontend: 1-5)
  let diffLevel = 1;
  if (task.Difficulty === "MEDIUM") diffLevel = 3;
  if (task.Difficulty === "HARD") diffLevel = 5;

  // Map Status
  let status: Quest['status'] = "open";
  if (task.Status === "IN_PROGRESS") status = "in-progress";
  if (task.Status === "IN_REVIEW") status = "review";
  if (task.Status === "COMPLETED") status = "completed";

  return {
    id: task.ID,
    title: task.Title,
    description: task.Description.substring(0, 100) + "...", // Short desc
    fullDescription: task.Description,
    rewardPoints: task.Point || 0,
    difficulty: diffLevel,
    estimatedTime: task.EstimatedTime,
    category: task.Type,
    status: status,
    providerId: task.EmployerID,
    providerName: task.EmployerName || "Unknown Guild Master",
    repoUrl: task.GitRepoUrl || undefined,
    branchName: task.ReqBranchName || undefined,
    bids: [], // TODO: Bids not yet supported by backend API
    assignedTo: task.AssigneeID || undefined,
    skills: task.Skills || "General",
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
