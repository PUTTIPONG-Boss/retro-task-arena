import { useGetQuests } from "@/features/quests/services/quest.service";
import QuestCard from "@/features/quests/components/QuestCard";
import { useState, useRef, useEffect } from "react";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import GuildBanner from "@/features/quests/components/GuildBanner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/store/authStore";
import { isSeniorOrAdmin } from "@/features/users/utils/roleUtils";
import { ListFilter, X } from "lucide-react";
import PixelSearch from "@/components/icons/PixelSearch";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/themeStore";

const QuestBoard = () => {
  const user = useAuthStore((s) => s.user);

  const { data: quests = [], isLoading, isError } = useGetQuests();
  const { t, i18n } = useTranslation();

  // States
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const { theme: appTheme } = useThemeStore();
  const isLight = appTheme === "light";
  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[14px]";

  // ปิด popup เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen((prev) => {
          if (prev) {
          }
          return false;
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = ["all", "frontend", "backend", "BUG FIX", "FEATURE"];
  const statuses = ["open", "in_progress", "completed", "all"];
  const isSeniorOrAdminUser = isSeniorOrAdmin(user?.role || "");

  const filtered = quests.filter((q) => {
    const catMatch =
      filter === "all" || q.category?.toLowerCase() === filter.toLowerCase();
    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "open"
          ? (q.status === "open" || q.status === "bidding" || q.status === "in-progress" || q.status === "review")
          : q.status === (statusFilter === "in_progress" ? "in-progress" : statusFilter);
    const searchMatch =
      searchQuery.trim() === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen">
      <GuildBanner />

      <div className="max-w-[1280px] mx-auto px-4 mt-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative w-full max-w-md group">
            <div className={cn(
              "absolute inset-0 pointer-events-none border-2",
              isLight
                ? "bg-[#E8CFA0]/90 border-[#8B5A20] group-focus-within:border-[#5C3010]"
                : "bg-background/50 border-amber-400 group-focus-within:border-amber-300"
            )}></div>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm z-10">
              <PixelSearch size={20} className={cn("inline mr-1", isLight ? "text-[#6B3810]" : "text-yellow-400")} />
            </span>
            <PixelInput
              type="text"
              placeholder={t("questBoard.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                `w-full pl-10 pr-4 py-3 bg-transparent border-2 focus:ring-0 font-pixel ${fontClass}`,
                isLight
                  ? "border-[#8B5A20] text-[#3D1C08] placeholder:text-[#8B5A30]"
                  : "border-amber-400 focus:border-amber-300 text-amber-400 placeholder:text-amber-400/70"
              )}
            />
          </div>

          <div className="relative" ref={filterRef}>
            <PixelButton
              variant="gold"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
              }}
              className="font-pixel flex items-center gap-2 h-full"
            >
              {isFilterOpen ? <X size={18} strokeWidth={2.5} /> : <ListFilter size={18} />}
              <span className={`hidden sm:inline ${fontClass}`}>
                {t("questBoard.filter")}
              </span>
            </PixelButton>

            {isFilterOpen && (
              <div className={cn(
                "absolute right-0 mt-3 w-[280px] z-50 p-5 shadow-2xl pixel-border",
                isLight ? "bg-[#E8CFA0]" : "bg-[#1a1a1a]"
              )}>
                <div className="space-y-6">
                  <div>
                    <p className={cn(
                      "font-pixel mb-3 uppercase pb-1",
                      isLight ? "text-[#3D1C08] border-b border-[#8B5A20]/40" : "text-accent border-b border-white/10",
                      i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                    )}>
                      {t("questBoard.queststatus")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={cn(
                            "font-pixel px-2 py-1 border-2 transition-colors",
                            isLight
                              ? statusFilter === s
                                ? "border-[#6B3010] text-[#6B3010] bg-[#C89A50]"
                                : "border-[#B8903A] text-[#8B5A30] hover:border-[#6B3010]"
                              : statusFilter === s
                                ? "border-gold text-gold bg-gold/10"
                                : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
                            i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                          )}
                        >
                          {t(`questBoard.queststatuses.${s}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={cn(
                      "font-pixel mb-3 uppercase pb-1",
                      isLight ? "text-[#3D1C08] border-b border-[#8B5A20]/40" : "text-accent border-b border-white/10",
                      i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                    )}>
                      {t("questBoard.category")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFilter(cat)}
                          className={cn(
                            "font-pixel px-2 py-1 border-2 transition-colors",
                            isLight
                              ? filter === cat
                                ? "border-[#6B3010] text-[#6B3010] bg-[#C89A50]"
                                : "border-[#B8903A] text-[#8B5A30] hover:border-[#6B3010]"
                              : filter === cat
                                ? "border-gold text-gold bg-gold/10"
                                : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
                            i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                          )}
                        >
                          {t(`questBoard.categories.${cat}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <PixelButton
                      variant="gold"
                      className={`font-pixel flex-1 flex items-center justify-center gap-1 h-10 ${fontClass}`}
                      onClick={() => setIsFilterOpen(false)}
                    >
                      <PixelSearch size={20} /> {t("questBoard.searchPlaceholder")}
                    </PixelButton>
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      className={`font-pixel flex-1 flex items-center justify-center gap-1 h-10 ${fontClass}`}
                      onClick={() => {
                        setFilter("all");
                        setStatusFilter("open");
                        setSearchQuery("");
                        setIsFilterOpen(false);
                      }}
                    >
                      <X size={18} /> {t("questBoard.clearFilters")}
                    </PixelButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Post Quest & Result Count */}
        <div className="mb-6 flex justify-between items-end">
          {isSeniorOrAdminUser ? (
            <Link to="/create-quest">
              <PixelButton
                variant="gold"
                size="md"
                className="font-pixel flex items-center gap-2 h-11"
              >
                <PixelClipboardList size={22} />
                <span className={fontClass}>
                  {t("questBoard.postNewQuest")}
                </span>
              </PixelButton>
            </Link>
          ) : (
            <div></div>
          )}

          {searchQuery && (
            <p className={`font-pixel text-muted-foreground ${fontClass}`}>
              {t("questBoard.found")}
              <span className="text-accent">{filtered.length}</span>
            </p>
          )}
        </div>

        {/* --- Quest Grid & Loading States --- */}
        {isLoading ? (
          <div className="text-center py-20 animate-pulse font-pixel text-accent">
            {t("questBoard.loading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filtered.map((quest) => (
              <QuestCard key={quest.id} quest={quest as any} />
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-20 pixel-border bg-secondary/50">
            <p className={`font-pixel text-muted-foreground ${fontClass}`}>
              {t("questBoard.noQuests")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestBoard;
