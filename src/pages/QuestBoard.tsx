import { mockQuests } from "@/data/mockData";
import QuestCard from "@/components/QuestCard";
import questBoardHero from "@/assets/quest-board-hero.png";
import { useState } from "react";
import PixelButton from "@/components/PixelButton";

const QuestBoard = () => {
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...new Set(mockQuests.map((q) => q.category))];
  const filtered = filter === "all" ? mockQuests : mockQuests.filter((q) => q.category === filter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[280px] overflow-hidden pixel-border">
        <img
          src={questBoardHero}
          alt="Quest Board"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-3">
          <h1 className="font-pixel text-[18px] sm:text-[22px] text-accent pixel-text-shadow text-center leading-relaxed">
            Heed the Call, Adventurer!
          </h1>
          <p className="font-pixel text-[10px] text-foreground pixel-text-shadow">
            Your Next Quest Awaits
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

      {/* Filters */}
      <div className="max-w-[1280px] mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 mb-6">
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
