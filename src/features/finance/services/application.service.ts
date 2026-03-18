import { apiClient } from "@/lib/api";

export interface TaskApplication {
  id: string;
  taskId: string;
  userId: string;
  status: string;
  createdAt: string;
  task?: {
    title: string;
    rewardPoints: number;
    status: string;
  };
}

export async function getMyApplications(): Promise<TaskApplication[]> {
  const response = await apiClient.get("/user/applications");
  return response.data;
}
