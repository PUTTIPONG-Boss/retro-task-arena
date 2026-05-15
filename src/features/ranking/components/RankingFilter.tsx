import { motion } from "framer-motion";
import { useRankingStore, SortOption } from "../store/rankingStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Sword } from "lucide-react";
import PixelTrophy from "@/components/icons/PixelTrophy";

import PixelCoin from "@/components/icons/PixelCoin";

const RankingFilter = () => {
  const { t } = useTranslation();
  const { sortBy, setSortBy } = useRankingStore();

  const options: { id: SortOption; label: string; icon: React.ReactNode }[] = [
    { id: "exp", label: t("ranking.filter.exp"), icon: <PixelTrophy size={14} /> },
    { id: "quests", label: t("ranking.filter.quests"), icon: <Sword size={14} /> },
    { id: "points", label: t("ranking.filter.points"), icon: <PixelCoin size={14} /> },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="font-pixel text-[14px] text-muted-foreground uppercase tracking-widest mr-2">
        {t("ranking.filter.sortBy")}
      </span>
      <div className="flex gap-1 bg-black/40 p-1 border border-border/50 pixel-border-sm">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={cn(
              "font-pixel text-[14px] px-4 py-2 flex items-center gap-2 transition-all relative",
              sortBy === option.id
                ? "text-accent bg-accent/10 shadow-[inset_0_0_10px_rgba(241,196,15,0.2)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <span className="text-sm">{option.icon}</span>
            {option.label}
            
            {sortBy === option.id && (
              <motion.div
                layoutId="active-filter"
                className="absolute inset-0 border-2 border-accent/50 pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RankingFilter;
