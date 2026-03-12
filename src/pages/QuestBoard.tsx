import { useQuestContext } from "@/context/QuestContext";
import QuestCard from "@/components/QuestCard";
import { useState } from "react";
import PixelButton from "@/components/PixelButton";
import { Link } from "react-router-dom";

const QuestBoard = () => {
  const { quests } = useQuestContext();
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");

  const categories = ["all", ...new Set(quests.map((q) => q.category))];

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
      {/* Hero */}
      <div className="relative w-full h-[200px] overflow-hidden pixel-border bg-secondary">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <h1 className="font-pixel text-[18px] sm:text-[22px] text-accent pixel-text-shadow text-center leading-relaxed">
            ⚔ Quest Board
          </h1>
          <p className="font-pixel text-[10px] text-foreground pixel-text-shadow">
            Accept quests. Earn gold. Level up.
          </p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="animate-blink-star text-accent" style={{ animationDelay: `${i * 0.4}s` }}>
                ✦
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 mt-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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

        {/* Post Quest CTA */}
        <div className="mb-6">
          <Link to="/create-quest">
            <PixelButton variant="gold" size="md">
              📜 Post New Quest
            </PixelButton>
          </Link>
        </div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>

        {filtered.length === 0 && (
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
