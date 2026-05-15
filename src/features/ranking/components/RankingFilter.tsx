import { motion } from "framer-motion";
import { useRankingStore, SortOption } from "../store/rankingStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Sword } from "lucide-react";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelCoin from "@/components/icons/PixelCoin";
import { useThemeStore } from "@/store/themeStore";

const RankingFilter = () => {
  const { t } = useTranslation();
  const { sortBy, setSortBy } = useRankingStore();
  const { theme } = useThemeStore();
  const isLight = theme === "light";

  const options: { id: SortOption; label: string; icon: React.ReactNode }[] = [
    { id: "exp", label: t("ranking.filter.exp"), icon: <PixelTrophy size={14} /> },
    { id: "quests", label: t("ranking.filter.quests"), icon: <Sword size={14} /> },
    { id: "points", label: t("ranking.filter.points"), icon: <PixelCoin size={14} /> },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className={cn(
        "font-pixel text-[14px] uppercase tracking-widest mr-2",
        isLight ? "text-amber-800" : "text-muted-foreground"
      )}>
        {t("ranking.filter.sortBy")}
      </span>
      <div className={cn(
        "flex gap-1 p-1 pixel-border",
        isLight ? "bg-card" : "bg-black/40 border border-border/50"
      )}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={cn(
              "font-pixel text-[14px] px-4 py-2 flex items-center gap-2 transition-all relative",
              sortBy === option.id
                ? isLight
                  ? "text-amber-800 bg-amber-600/15"
                  : "text-accent bg-accent/10 shadow-[inset_0_0_10px_rgba(241,196,15,0.2)]"
                : isLight
                  ? "text-stone-700 hover:text-amber-900 hover:bg-amber-600/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <span className="text-sm">{option.icon}</span>
            {option.label}
            
            {sortBy === option.id && (
              <motion.div
                layoutId="active-filter"
                className={cn(
                  "absolute inset-0 border-2 pointer-events-none",
                  isLight ? "border-amber-700/70" : "border-accent/50"
                )}
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
