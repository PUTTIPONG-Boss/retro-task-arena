import { Quest } from "@/data/mockData";
import { Link } from "react-router-dom";
import DifficultyStars from "./DifficultyStars";
import { motion } from "framer-motion";

interface QuestCardProps {
  quest: Quest;
}

const statusColors: Record<string, string> = {
  open: "text-success",
  bidding: "text-accent",
  "in-progress": "text-accent",
  review: "text-accent",
  completed: "text-muted-foreground",
};

const statusIcons: Record<string, string> = {
  open: "🟢",
  bidding: "📨",
  "in-progress": "⚒",
  review: "🔍",
  completed: "✅",
};

const QuestCard = ({ quest }: QuestCardProps) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
      <Link to={`/quest/${quest.id}`}>
        <div className="bg-card pixel-border p-5 hover:gold-glow cursor-pointer h-full flex flex-col gap-3 transition-shadow duration-200 hover:shadow-[0_0_12px_2px_hsl(var(--gold)/0.25)]">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[8px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              📂 {quest.category}
            </span>
            <span className={`font-pixel text-[8px] uppercase flex items-center gap-1 ${statusColors[quest.status] || "text-foreground"}`}>
              {statusIcons[quest.status] || "●"} {quest.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-pixel text-[11px] leading-relaxed text-foreground pixel-text-shadow flex items-start gap-2">
            <span className="text-base mt-0.5">📜</span>
            <span>{quest.title}</span>
          </h3>

          {/* Description */}
          <p className="text-lg leading-snug text-muted-foreground line-clamp-2 flex-1">
            {quest.description}
          </p>

          {/* Stats */}
          <div className="border-t-2 border-border pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-accent pixel-text-shadow flex items-center gap-1">
                🪙 {quest.rewardPoints} GP
              </span>
              <DifficultyStars level={quest.difficulty} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground flex items-center gap-1">
                ⏳ {quest.estimatedTime}
              </span>
              <span className="text-base text-muted-foreground flex items-center gap-1">
                📋 {quest.bids.length} bid{quest.bids.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-muted-foreground font-pixel text-[7px] flex items-center gap-1">
            👤 {quest.providerName}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuestCard;
