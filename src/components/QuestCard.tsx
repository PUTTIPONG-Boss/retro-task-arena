import { Quest } from "@/data/mockData";
import { Link } from "react-router-dom";
import DifficultyStars from "./DifficultyStars";
import { motion } from "framer-motion";

interface QuestCardProps {
  quest: Quest;
}

const QuestCard = ({ quest }: QuestCardProps) => {
  const statusColors = {
    open: "text-green-400",
    "in-progress": "text-accent",
    completed: "text-muted-foreground",
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
      <Link to={`/quest/${quest.id}`}>
        <div className="parchment pixel-border p-5 hover:animate-pulse-gold cursor-pointer h-full flex flex-col gap-3">
          {/* Category badge */}
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[8px] uppercase tracking-widest text-parchment-foreground/60">
              {quest.category}
            </span>
            <span className={`font-pixel text-[8px] uppercase ${statusColors[quest.status]}`}>
              ● {quest.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-pixel text-[11px] leading-relaxed text-parchment-foreground pixel-text-shadow">
            {quest.title}
          </h3>

          {/* Description */}
          <p className="text-lg leading-snug text-parchment-foreground/80 line-clamp-2 flex-1">
            {quest.description}
          </p>

          {/* Stats row */}
          <div className="border-t-2 border-parchment-foreground/20 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] text-accent pixel-text-shadow flex items-center gap-1">
                🪙 {quest.rewardPoints} GP
              </span>
              <DifficultyStars level={quest.difficulty} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-parchment-foreground/60">
                ⏳ {quest.estimatedTime}
              </span>
              <span className="text-base text-parchment-foreground/60">
                📋 {quest.bids.length} bid{quest.bids.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Provider */}
          <div className="text-sm text-parchment-foreground/50 font-pixel text-[7px]">
            Posted by: {quest.providerName}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuestCard;
