import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export interface PublicProfile {
  userId: string;
  username: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  role: "ADMIN" | "JUNIOR" | "SENIOR";
  level: number;
  totalExp: number;
  rating: number;
  totalRatings: number;
  createdAt: string;
  email?: string;
  skills?: string[];
  github?: string;
  linkin?: string;
  questsCompleted?: number;
}

export const useGetPublicProfile = (userId: string) => {
  return useQuery<PublicProfile>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await apiClient.get<PublicProfile>(`/profile/${userId}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};