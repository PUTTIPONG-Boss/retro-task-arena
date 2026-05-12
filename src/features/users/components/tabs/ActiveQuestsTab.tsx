import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, Hourglass, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PixelFrame from "@/components/PixelFrame";
import PixelCoin from "@/components/icons/PixelCoin";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { UserProfile } from "../../types";

interface ActiveQuestsTabProps {
  user: UserProfile;
  quests: any[];
}

const ActiveQuestsTab: React.FC<ActiveQuestsTabProps> = ({ user, quests }) => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = React.useState<"in-progress" | "review" | "completed">("in-progress");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const fontClass = i18n.language === "th" ? "text-[20px]" : "text-[20px]";

  const myQuests = quests.filter((q) => q.assignedTo === user.id);
  const filteredMyQuests = myQuests
    .filter((q) => {
      if (activeFilter === "in-progress") return q.status === "in-progress";
      if (activeFilter === "review") return q.status === "review";
      if (activeFilter === "completed") return q.status === "completed";
      return false;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "review": return <Hourglass size={14} className="text-yellow-400" />;
      case "completed": return <CheckCircle2 size={14} className="text-success" />;
      default: return <Clock size={14} className="text-accent" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const key = status === "review" ? "in_review" :
      status === "in-progress" ? "in_progress" : status;
    return t(`questDetail.status.${key}`);
  };

  return (
    <div className="space-y-8">
      <PixelFrame className="relative overflow-visible">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-pixel-shadow/10 pb-4">
          <h2 className={`text-foreground pixel-text-shadow font-pixel ${fontClass} flex items-center gap-2`}>
            <Clock size={20} className="text-yellow-400" /> {t("userProfile.activeQuests")}
          </h2>

          <div className="flex flex-wrap gap-2">
            <div className="flex bg-background/50 p-1 pixel-border">
              {(["in-progress", "review", "completed"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-3 py-1 font-pixel transition-all",
                    i18n.language === "th" ? "text-[14px]" : "text-[14px]",
                    activeFilter === filter
                      ? "bg-accent text-accent-foreground shadow-[inset_-2px_-2px_0px_#00000044]"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {t(`questBoard.queststatuses.${filter === 'review' ? 'in_review' : filter.replace("-", "_")}`)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="pixel-border bg-secondary hover:bg-muted px-2 py-1 font-pixel text-[14px] text-accent transition-colors"
            >
              {sortOrder === "desc" ? "↓ " + t("userProfile.activity.sortNewest") : "↑ " + t("userProfile.activity.sortOldest")}
            </button>
          </div>
        </div>

        {filteredMyQuests.length === 0 ? (
          <div className="py-12 text-center">
            <p className={`text-muted-foreground font-pixel ${fontClass} opacity-50`}>
              {activeFilter === 'completed'
                ? (i18n.language === 'th' ? "ยังไม่มีภารกิจที่สำเร็จในหมวดนี้..." : "No completed quests yet...")
                : t("userProfile.noActiveQuests")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMyQuests.map((q) => (
              <Link
                key={q.id}
                to={q.status === 'completed' ? `/quest/${q.id}` : `/quest/${q.id}/workspace`}
                className="group"
              >
                <div className="pixel-border bg-secondary/40 p-4 h-full flex flex-col justify-between hover:bg-muted/80 transition-all hover:translate-y-[-2px] hover:shadow-xl">
                  <div className="mb-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={cn(
                        "font-pixel text-accent truncate flex-1",
                        i18n.language === "th" ? "text-[14px]" : "text-[14px]"
                      )}>{q.category}</span>
                      <div className="flex items-center gap-1 bg-background/80 px-2 py-0.5 rounded-sm">
                        {getStatusIcon(q.status)}
                        <span className={cn(
                          "font-pixel uppercase",
                          i18n.language === "th" ? "text-[14px]" : "text-[14px]",
                          q.status === 'review' ? "text-yellow-400" :
                            q.status === 'completed' ? "text-success" : "text-accent"
                        )}>
                          {getStatusLabel(q.status)}
                        </span>
                      </div>
                    </div>
                    <p className={`text-foreground font-pixel leading-relaxed group-hover:text-accent transition-colors ${fontClass}`}>
                      {q.title}
                    </p>
                  </div>

                  <div className="flex justify-between items-end border-t border-pixel-shadow/10 pt-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hourglass size={14} className="text-yellow-400/70" />
                        <span className={cn(
                          "font-pixel",
                          i18n.language === "th" ? "text-[14px]" : "text-[14px]"
                        )}>{q.estimatedTime}</span>
                      </div>
                      <DifficultyStars level={q.difficulty} />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-accent font-pixel",
                      i18n.language === "th" ? "text-[14px]" : "text-[14px]"
                    )}>
                      <PixelCoin size={18} />
                      <span>{q.rewardPoints} P</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PixelFrame>
    </div>
  );
};

export default ActiveQuestsTab;
