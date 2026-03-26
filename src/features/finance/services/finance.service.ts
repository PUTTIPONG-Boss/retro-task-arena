import { apiClient } from "@/lib/api";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: string;
  referenceId: string;
  description?: string;
  orderId?: string;
  createdAt: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient.get<{ message: string; data: Transaction[] | null }>("/user/transactions");
  return response.data?.data || [];
}

// Add more finance-related functions here (e.g., withdraw, top-up)
