import { useState } from "react";
import { useGetCompletedUserTasks } from "../services/quest.service";
import PixelCheck from "@/components/icons/PixelCheck";
import PixelScroll from "@/components/icons/PixelScroll";
import { Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/store/themeStore";

interface PortfolioSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  fontClass?: string;
  initialSelectedTasks?: { id: string; title: string }[];
}

const PortfolioSelector = ({
  selectedIds,
  onChange,
  fontClass = "text-[16px]",
  initialSelectedTasks = [],
}: PortfolioSelectorProps) => {
  const { t } = useTranslation();
  const { data: completedTasks = [], isLoading } = useGetCompletedUserTasks();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useThemeStore();
  const isLight = theme === "light";
  const lightBlack = "#1a1008";

  const toggleTask = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className={`space-y-2 ${fontClass}`}>
      {/* Header / Toggle */}
      <button
        type="button"
        className={`w-full flex items-center justify-between pixel-border bg-secondary px-3 py-2 hover:bg-muted transition-colors font-pixel ${fontClass}`}
        onClick={() => setIsExpanded((v) => !v)}
      >
        <span className="flex items-center gap-2 text-accent" style={isLight ? { color: lightBlack } : undefined}>
          <PixelScroll size={14} color="currentColor" className="text-gold" />
          {t("questDetail.portfolio.titlePlain")}
          {selectedIds.length > 0 && (
            <span className="bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-pixel">
              {t("questDetail.portfolio.itemsCount", { count: selectedIds.length })}
            </span>
          )}
        </span>
        <span className="text-muted-foreground text-[12px]" style={isLight ? { color: lightBlack } : undefined}>
          {isExpanded ? t("questDetail.portfolio.hide") : t("questDetail.portfolio.select")}
        </span>
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <div className="pixel-border border-border/60 bg-background/80 p-3 space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <p className={`font-pixel text-muted-foreground animate-pulse ${fontClass}`}>
              {t("questDetail.portfolio.loading")}
            </p>
          ) : completedTasks.length === 0 ? (
            <p className={`font-pixel text-muted-foreground ${fontClass}`}>
              {t("questDetail.portfolio.noCompleted")}
            </p>
          ) : (
            completedTasks.map((task) => {
              const isSelected = selectedIds.includes(task.id);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-full text-left pixel-border p-3 transition-colors flex items-start gap-3 ${
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border/40 bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`mt-0.5 w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center ${
                      isSelected ? "border-accent bg-accent" : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && <PixelCheck size={10} color="#000" />}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-pixel text-foreground text-[13px] truncate ${fontClass}`}
                      style={isLight ? { color: lightBlack } : undefined}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-[11px] font-pixel uppercase text-muted-foreground ${fontClass}`}
                        style={isLight ? { color: lightBlack } : undefined}
                      >
                        {task.category}
                      </span>
                      <span
                        className={`text-[11px] font-pixel text-gold flex items-center gap-1 ${fontClass}`}
                      >
                        <Coins size={10} className="inline" />
                        {task.rewardPoints} GP
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-accent text-[11px] font-pixel flex-shrink-0" style={isLight ? { color: lightBlack } : undefined}>
                      {t("questDetail.portfolio.selected")}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Selected Summary */}
      {selectedIds.length > 0 && (
        <div className="pixel-border border-accent/30 bg-accent/5 px-3 py-2">
          <p className={`font-pixel text-[12px] text-accent ${fontClass}`} style={isLight ? { color: lightBlack } : undefined}>
            {t("questDetail.portfolio.selectedCount", { count: selectedIds.length })}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedIds.map((sid) => {
              const task = completedTasks.find((t) => t.id === sid) || initialSelectedTasks.find((t) => t.id === sid);
              const title = task ? task.title : `Task ${sid.substring(0, 8)}`;
              return (
                <span
                  key={sid}
                  className="bg-accent/20 border border-accent/40 px-2 py-0.5 text-[11px] font-pixel text-accent flex items-center gap-1"
                  style={isLight ? { color: lightBlack } : undefined}
                >
                  {title.length > 20 ? title.substring(0, 20) + "…" : title}
                  <button
                    type="button"
                    onClick={() => toggleTask(sid)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSelector;