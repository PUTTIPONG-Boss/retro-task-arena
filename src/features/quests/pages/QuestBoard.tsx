import { useGetQuests } from "@/features/quests/services/quest.service";
import QuestCard from "@/features/quests/components/QuestCard";
import { useState } from "react";
import PixelButton from "@/components/PixelButton";
import PixelDivider from "@/components/PixelDivider";
import GuildBanner from "@/features/quests/components/GuildBanner";
import { Link } from "react-router-dom";

const QuestBoard = () => {
  const { data: quests = [], isLoading, isError } = useGetQuests();
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const categories = ["all", "FRONTEND", "BACKEND", "DEVOPS", "BUG FIX", "FEATURE"];

  const filtered = quests.filter((q) => {
    const catMatch = filter === "all" || q.category === filter;
    const statusMatch =
      statusFilter === "all" ? true :
        statusFilter === "active" ? q.status !== "completed" :
          q.status === statusFilter;
    return catMatch && statusMatch;
  });

  return (
    <div className="min-h-screen">
      <GuildBanner />

      <div className="max-w-[1280px] mx-auto px-4 mt-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <PixelButton
                key={cat}
                variant={filter === cat ? "gold" : "ghost"}
                size="sm"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </PixelButton>
            ))}
          </div>
          <div className="flex gap-2">
            {["active", "completed", "all"].map((s) => (
              <PixelButton
                key={s}
                variant={statusFilter === s ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </PixelButton>
            ))}
          </div>
        </div>

        <PixelDivider label="Quest List" />

        {/* Post Quest CTA */}
        <div className="mb-6">
          <Link to="/create-quest">
            <PixelButton variant="gold" size="md">
              📜 Post New Quest
            </PixelButton>
          </Link>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="font-pixel text-[12px] text-accent pixel-text-shadow animate-pulse">
              Summoning quests from the backend realm...
            </p>
          </div>
        )}

        {isError && (
          <div className="text-center py-20 border-2 border-destructive p-4 mt-4 bg-destructive/10">
            <p className="font-pixel text-[12px] text-destructive pixel-text-shadow">
              Failed to connect to the backend API.
            </p>
            <p className="text-lg text-muted-foreground mt-2">Is the Go Fiber server running on port 5000?</p>
          </div>
        )}

        {/* Quest Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filtered.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && !isError && (
          <div className="text-center py-20">
            <p className="font-pixel text-[12px] text-muted-foreground pixel-text-shadow">
              No quests found in this realm...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestBoard;
