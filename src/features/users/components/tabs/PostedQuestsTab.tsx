import React from "react";
import { useTranslation } from "react-i18next";
import { Archive, Clock, Hourglass, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { useGetBids } from "@/features/quests/services/quest.service";
import { UserProfile } from "../../types";

interface PostedQuestsTabProps {
  user: UserProfile;
  quests: any[];
}

const PostedQuestsTab: React.FC<PostedQuestsTabProps> = ({ user, quests }) => {
  const { t, i18n } = useTranslation();
  const [postedFilter, setPostedFilter] = React.useState<"open" | "in-progress" | "review" | "completed">("open");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const fontClass = i18n.language === "th" ? "text-[20px]" : "text-[20px]";

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const postedQuests = quests.filter((q) => q.providerId === user.id);
  const filteredPostedQuests = postedQuests
    .filter((q) => {
      if (postedFilter === "open") return q.status === "open" || q.status === "bidding";
      if (postedFilter === "in-progress") return q.status === "in-progress";
      if (postedFilter === "review") return q.status === "review";
      if (postedFilter === "completed") return q.status === "completed";
      return false;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredPostedQuests.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [postedFilter, sortOrder]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const slicedQuests = filteredPostedQuests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <PixelFrame className="border-muted-foreground/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-pixel-shadow/10 pb-4">
          <h2 className={`font-pixel text-foreground pixel-text-shadow ${fontClass} flex items-center gap-2`}>
            <Archive size={20} className="text-yellow-400" /> {t("userProfile.postQuests")}
          </h2>

          <div className="flex flex-wrap gap-2">
            <div className="flex bg-background/50 p-1 pixel-border">
              {(["open", "in-progress", "review", "completed"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPostedFilter(filter)}
                  className={cn(
                    "px-3 py-1 font-pixel transition-all",
                    i18n.language === "th" ? "text-[14px]" : "text-[14px]",
                    postedFilter === filter
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
              className={`pixel-border bg-secondary hover:bg-muted px-2 py-1 font-pixel text-accent transition-colors ${i18n.language === "th" ? "text-[14px]" : "text-[14px]"}`}
            >
              {sortOrder === "desc" ? "↓ " + t("userProfile.activity.sortNewest") : "↑ " + t("userProfile.activity.sortOldest")}
            </button>
          </div>
        </div>

        {filteredPostedQuests.length === 0 ? (
          <div className="py-12 text-center">
            <p className={`text-muted-foreground font-pixel ${fontClass} opacity-50`}>
              {t("userProfile.noPostedQuests")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slicedQuests.map((q) => (
                <PostedQuestCard key={q.id} quest={q} fontClass={fontClass} />
              ))}
            </div>

            {/* Retro Pixelated Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2 font-pixel text-sm bg-secondary/10 border border-[#333] select-none mt-6">
                <div className="text-muted-foreground">
                  Showing <span className="text-foreground font-bold">{startIndex + 1}</span> to{" "}
                  <span className="text-foreground font-bold">
                    {Math.min(startIndex + itemsPerPage, filteredPostedQuests.length)}
                  </span>{" "}
                  of <span className="text-foreground font-bold">{filteredPostedQuests.length}</span> entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-3 py-1 bg-[#1a1c1e] text-foreground border border-[#333] hover:border-accent disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 active:scale-95",
                      currentPage === 1 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    ◀ Prev
                  </button>
                  <span className="text-muted-foreground px-2">
                    Page <span className="text-accent font-bold">{currentPage}</span> of{" "}
                    <span className="text-foreground font-bold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "px-3 py-1 bg-[#1a1c1e] text-foreground border border-[#333] hover:border-accent disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150 active:scale-95",
                      currentPage === totalPages && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </PixelFrame>
    </div>
  );
};

const PostedQuestCard: React.FC<{ quest: any; fontClass: string }> = ({ quest: q, fontClass }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: bids = [] } = useGetBids(q.id);

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

  const hasBids = bids.length > 0;

  return (
    <div className="group relative">
      <div
        onClick={() => navigate(`/quest/${q.id}`)}
        className="pixel-border bg-secondary/20 p-4 h-full flex flex-col justify-between hover:bg-muted/80 transition-all hover:translate-y-[-2px] hover:shadow-xl cursor-pointer"
      >
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

          {(q.status === 'open' || q.status === 'bidding') && bids.length > 0 && (
            <div className={cn(
              "mt-2 flex items-center gap-2 text-yellow-400 font-pixel",
              i18n.language === "th" ? "text-[12px]" : "text-[11px]"
            )}>
              <span className="animate-pulse">⚔</span>
              <span>{bids.length} {t("questCard.totalBids")}</span>
            </div>
          )}
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
          <div className="flex gap-2">
            {hasBids ? (
              <div className="group/edit relative">
                <PixelButton
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-pixel border border-muted-foreground/20 opacity-50 cursor-not-allowed h-8",
                    i18n.language === "th" ? "text-[11px]" : "text-[9px]"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("userProfile.editPostedQuests")}
                </PixelButton>
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-background border-2 border-destructive pixel-border text-[9px] text-destructive whitespace-nowrap opacity-0 group-hover/edit:opacity-100 transition-opacity z-50 pointer-events-none">
                  {i18n.language === 'th' ? "ไม่สามารถแก้ไขได้เนื่องจากมีการประมูลแล้ว" : "Cannot edit: Quests already has active bids"}
                </div>
              </div>
            ) : (
              <PixelButton
                variant="ghost"
                size="sm"
                className={cn(
                  "font-pixel border border-accent/20 hover:border-accent hover:bg-accent/10 h-8",
                  i18n.language === "th" ? "text-[14px]" : "text-[14px]"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/quest/${q.id}/edit`);
                }}
              >
                {t("userProfile.editPostedQuests")}
              </PixelButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostedQuestsTab;
