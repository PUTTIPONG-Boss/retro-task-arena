import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { LeaderboardEntry, RankingTab } from "../types";
import { MOCK_LEADERBOARD_ENTRIES } from "../mockdata/leaderboardMock";

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
        const response = await apiClient.get(`/leaderboard?type=${type}`);
        const apiData: LeaderboardEntry[] = response.data.data || [];

        // fallback to mock when real data is too few to render the leaderboard
        if (apiData.length < 3) {
          console.warn(`[Leaderboard] only ${apiData.length} entries from API — using mock data`);
          return MOCK_LEADERBOARD_ENTRIES;
        }

        return apiData;
      } catch (error) {
        console.error("Leaderboard API Error:", error);
        return MOCK_LEADERBOARD_ENTRIES;
      }
    },
    staleTime: 1000 * 60,
  });
};