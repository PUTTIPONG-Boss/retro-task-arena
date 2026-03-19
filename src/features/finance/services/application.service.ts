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

export interface MyBid {
  id: string;          // application ID
  taskId: string;
  userId: string;
  bidAmount: number;
  waitDuration: string;
  note: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  taskTitle: string;   // from JOIN with tasks table
}

export async function getMyApplications(): Promise<TaskApplication[]> {
  const response = await apiClient.get("/user/applications");
  return response.data;
}

export async function getMyBids(): Promise<MyBid[]> {
  const response = await apiClient.get<{ message: string; data: MyBid[] | null }>("/user/bids");
  const data = response.data?.data;
  if (!data || !Array.isArray(data)) return [];
  // Map PascalCase backend response to camelCase
  return data.map((b: any) => ({
    id: b.ID ?? b.id,
    taskId: b.TaskID ?? b.taskId,
    userId: b.UserID ?? b.userId,
    bidAmount: b.BidAmount ?? b.bidAmount ?? 0,
    waitDuration: b.WaitDuration ?? b.waitDuration ?? "",
    note: b.Note ?? b.note ?? "",
    status: b.Status ?? b.status ?? "PENDING",
    createdAt: b.CreatedAt ?? b.createdAt ?? "",
    taskTitle: b.TaskTitle ?? b.taskTitle ?? "Unknown Quest",
  }));
}
