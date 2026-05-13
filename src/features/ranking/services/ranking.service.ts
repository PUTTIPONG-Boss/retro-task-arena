import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { LeaderboardEntry, RankingTab } from "../types";

// ─── Tab → API type mapping ──────────────────────────────────────────────────
const TAB_TO_API_TYPE: Record<RankingTab, string> = {
  points: "exp",
  quests: "quests",
  weekly: "weekly",
  guild: "guild",
};

// ─── Hook: ดึง leaderboard จาก API ──────────────────────────────────────────
export const useGetLeaderboard = (tab: RankingTab) => {
  const type = TAB_TO_API_TYPE[tab] || "exp";

  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", type],
    queryFn: async () => {
      try {
        // ดึงข้อมูลจริงจาก API
        const response = await apiClient.get(`/leaderboard?type=${type}`);
        const apiData = response.data.data || [];
        
        return apiData;
      } catch (error) {
        console.error("Leaderboard API Error:", error);
        return [];
      }
    },
    staleTime: 1000 * 60, // cache 1 นาที
  });
};