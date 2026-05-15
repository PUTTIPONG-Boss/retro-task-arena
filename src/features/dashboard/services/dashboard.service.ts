import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { DashboardData } from "../types";

export const useGetDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<DashboardData>("/user/dashboard");
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};