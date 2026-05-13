// ─── Leaderboard Entry (จาก API /leaderboard?type=exp) ───────────────────────
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  nameTh: string;
  nameEn: string;
  avatarUrl: string;
  level: number;
  totalExp: number;
  rating: number;
  questsCompleted: number;
  totalPointsEarned: number;
}

// ─── Tab ─────────────────────────────────────────────────────────────────────
export type RankingTab = "points" | "quests" | "weekly" | "guild";

export interface TabItem {
  id: RankingTab;
  label: string;
  icon: string;
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
export interface RankingStat {
  label: string;
  value: string;
  subLabel: string;
  icon: string;
}