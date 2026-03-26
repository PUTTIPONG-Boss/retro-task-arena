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
  const response = await apiClient.get<{ message: string; data: TaskApplication[] | null }>("/user/applications");
  return response.data?.data || [];
}

export async function getMyBids(): Promise<MyBid[]> {
  const response = await apiClient.get<{ message: string; data: MyBid[] | null }>("/user/bids");
  const data = response.data?.data;
  if (!data || !Array.isArray(data)) return [];
  // Map PascalCase backend response to camelCase
  return data.map((b: any) => ({
    id: b.id || b.ID,
    taskId: b.taskId || b.TaskID,
    userId: b.userId || b.UserID,
    bidAmount: b.bidAmount ?? b.BidAmount ?? 0,
    waitDuration: b.waitDuration || b.WaitDuration || "",
    note: b.note || b.Note || "",
    status: b.status || b.Status || "PENDING",
    createdAt: b.createdAt || b.CreatedAt || "",
    taskTitle: b.taskTitle || b.TaskTitle || "Unknown Quest",
  }));
}
