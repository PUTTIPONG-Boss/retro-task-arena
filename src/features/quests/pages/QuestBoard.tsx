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

const QuestBoard = () => {
  const user = useAuthStore((s) => s.user);

  const { data: quests = [], isLoading, isError } = useGetQuests();
  const { t, i18n } = useTranslation();

  // Pending States (what the user sees in the UI)
  const [filter, setFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Applied States (what is actually used to filter the list)
  const [appliedFilters, setAppliedFilters] = useState({
    category: "all",
    difficulty: "all",
    sort: "newest",
    search: "",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[14px]";

  // Handle applying filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      category: filter,
      difficulty: difficultyFilter,
      sort: sortFilter,
      search: searchQuery,
    });
    setIsFilterOpen(false);
  };

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
  const sorts = ["newest", "oldest"];
  const difficulties = ["all", "easy", "medium", "hard"];
  const difficultyMap: Record<string, number> = {
    easy: 1,
    medium: 3,
    hard: 5,
  };

  const isSeniorOrAdminUser = isSeniorOrAdmin(user?.role || "");

  const filtered = quests
    .filter((q) => {
      // Hide completed quests
      if (q.status === "completed") return false;

      const catMatch =
        appliedFilters.category === "all" ||
        q.category?.toLowerCase() === appliedFilters.category.toLowerCase();

      const diffMatch =
        appliedFilters.difficulty === "all" ||
        q.difficulty === difficultyMap[appliedFilters.difficulty];

      const searchMatch =
        appliedFilters.search.trim() === "" ||
        q.title.toLowerCase().includes(appliedFilters.search.toLowerCase());

      return catMatch && diffMatch && searchMatch;
    })
    .sort((a, b) => {
      // 1. Status Priority: In Review and In Progress come first
      const getStatusPriority = (status: string) => {
        if (status === "review" || status === "in-progress") return 0;
        return 1;
      };

      const priorityA = getStatusPriority(a.status);
      const priorityB = getStatusPriority(b.status);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // 2. Date Sort (within same priority)
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return appliedFilters.sort === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="min-h-screen">
      <GuildBanner />

      <div className="max-w-[1280px] mx-auto px-4 mt-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-0 bg-background/50 border-2 border-amber-400 pointer-events-none group-focus-within:border-amber-300"></div>
            <button
              onClick={handleApplyFilters}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm z-20 cursor-pointer hover:scale-110 transition-transform active:scale-95"
            >
              <PixelSearch size={20} className="inline mr-1 text-yellow-400" />
            </button>
            <PixelInput
              type="text"
              placeholder={t("questBoard.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters();
              }}
              className={`w-full pl-10 pr-4 py-3 bg-transparent border-2 border-amber-400 focus:border-amber-300 focus:ring-0 text-amber-400 placeholder:text-amber-400/70 font-pixel ${fontClass}`}
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
              {isFilterOpen ? (
                <X size={18} strokeWidth={2.5} />
              ) : (
                <ListFilter size={18} />
              )}
              <span className={`hidden sm:inline ${fontClass}`}>
                {t("questBoard.filter")}
              </span>
            </PixelButton>

            {isFilterOpen && (
              <div className="absolute right-0 mt-3 w-[280px] bg-[#1a1a1a] pixel-border z-50 p-5 shadow-2xl">
                <div className="space-y-6">
                  {/* Sorting */}
                  <div>
                    <p
                      className={cn(
                        "font-pixel text-accent mb-3 uppercase border-b border-white/10 pb-1",
                        i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                      )}
                    >
                      {t("questBoard.sort")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sorts.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSortFilter(s);
                          }}
                          className={cn(
                            "font-pixel px-2 py-1 border-2 transition-colors",
                            sortFilter === s
                              ? "border-gold text-gold bg-gold/10"
                              : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
                            i18n.language === "th"
                              ? "text-[16px]"
                              : "text-[16px]"
                          )}
                        >
                          {t(`questBoard.sorts.${s}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <p
                      className={cn(
                        "font-pixel text-accent mb-3 uppercase border-b border-white/10 pb-1",
                        i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                      )}
                    >
                      {t("questBoard.difficulty")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setDifficultyFilter(d);
                          }}
                          className={cn(
                            "font-pixel px-2 py-1 border-2 transition-colors",
                            difficultyFilter === d
                              ? "border-gold text-gold bg-gold/10"
                              : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
                            i18n.language === "th"
                              ? "text-[16px]"
                              : "text-[16px]"
                          )}
                        >
                          {t(`questBoard.difficulties.${d}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <p
                      className={cn(
                        "font-pixel text-accent mb-3 uppercase border-b border-white/10 pb-1",
                        i18n.language === "th" ? "text-[16px]" : "text-[16px]"
                      )}
                    >
                      {t("questBoard.category")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setFilter(cat);
                          }}
                          className={cn(
                            "font-pixel px-2 py-1 border-2 transition-colors",
                            filter === cat
                              ? "border-gold text-gold bg-gold/10"
                              : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
                            i18n.language === "th"
                              ? "text-[16px]"
                              : "text-[16px]"
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
                      className={`font-pixel flex-1 flex items-center justify-center gap-1 h-10 text-black ${fontClass}`}
                      onClick={handleApplyFilters}
                    >
                      <PixelSearch size={20} className="text-black" />{" "}
                      {t("questBoard.searchPlaceholder")}
                    </PixelButton>
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      className={`font-pixel flex-1 flex items-center justify-center gap-1 h-10 text-white ${fontClass}`}
                      onClick={() => {
                        setFilter("all");
                        setDifficultyFilter("all");
                        setSortFilter("newest");
                        setSearchQuery("");
                        setAppliedFilters({
                          category: "all",
                          difficulty: "all",
                          sort: "newest",
                          search: "",
                        });
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
