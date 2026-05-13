import { useRankingStore } from "../store/rankingStore";
import { useGetLeaderboard } from "../services/ranking.service";

import RankingBanner from "../components/RankingBanner";
import StatsStrip from "../components/StatsStrip";
import PodiumTop3 from "../components/PodiumTop3";
import LeaderboardTable from "../components/LeaderboardTable";
import RankingFilter from "../components/RankingFilter";

import { useTranslation } from "react-i18next";

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="max-w-[1280px] mx-auto px-4 py-8 space-y-4">
    {[180, 72, 120, 400].map((h, i) => (
      <div key={i} className="bg-card animate-pulse" style={{ height: h }} />
    ))}
  </div>
);

// ─── Error state ──────────────────────────────────────────────────────────────
const ErrorState = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="font-pixel text-[10px] text-destructive uppercase tracking-widest">
        {t("ranking.error")}
      </p>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const RankingPage = () => {
  const { t } = useTranslation();
  const { activeTab, sortBy } = useRankingStore();

  const {
    data: entries,
    isLoading,
    isError,
  } = useGetLeaderboard(activeTab);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !entries) return <ErrorState />;

  // เรียงลำดับตาม sortBy ที่เลือก
  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === "quests") {
      return b.questsCompleted - a.questsCompleted;
    }
    if (sortBy === "points") {
      return (b.totalPointsEarned || 0) - (a.totalPointsEarned || 0);
    }
    return b.totalExp - a.totalExp;
  }).map((e, index) => ({
    ...e,
    rank: index + 1 // จัดอันดับใหม่ตามการเรียง
  }));

  // แยก Top 3 กับ Rank 4+
  const top3 = sortedEntries.slice(0, 3);
  const rest = sortedEntries.slice(3);

  return (
    <>
      {/* 1. Hero banner — กว้างสุดจอ */}
      <div className="mb-8">
        <RankingBanner />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 pb-16">
        {/* 2. Summary stats */}
        <StatsStrip entries={sortedEntries} />

        {/* 3. Filter Section */}
        <div className="flex justify-start">
          <RankingFilter />
        </div>

        {/* 4. TOP ADVENTURERS — Podium top 3 */}
        <PodiumTop3 entries={top3} />

        {/* 5. Rank 4+ ในตาราง (ไม่มีหัว LEADERBOARD แยก) */}
        {rest.length > 0 && <LeaderboardTable entries={rest} />}
      </div>
    </>
  );
};

export default RankingPage;