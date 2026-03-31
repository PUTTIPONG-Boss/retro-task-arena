import { useGetQuests } from "@/features/quests/services/quest.service";
import QuestCard from "@/features/quests/components/QuestCard";
import { useState, useRef, useEffect } from "react";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import GuildBanner from "@/features/quests/components/GuildBanner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ListFilter, X } from "lucide-react";
import PixelSearch from "@/components/icons/PixelSearch";
import PixelClipboardList from "@/components/icons/PixelClipboardList";

const QuestBoard = () => {
  const user = useAuthStore((s) => s.user);

  const { data: quests = [], isLoading, isError } = useGetQuests();
  const { t, i18n } = useTranslation();

  // States
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

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
  const statuses = ["active", "in-progress", "completed", "all"];
  const isSeniorOrEmployer = () => {
    if (!user) return false;
    const r = user.role.toLowerCase();
    return r.includes("senior") || r === "employer";
  };

  const filtered = quests.filter((q) => {
    const catMatch =
      filter === "all" || q.category?.toLowerCase() === filter.toLowerCase();
    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? (q.status === "open" || q.status === "bidding")
          : q.status === statusFilter;
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
            <div className="absolute inset-0 bg-background/50 border-2 border-amber-400 pointer-events-none group-focus-within:border-amber-300"></div>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm z-10">
              <PixelSearch size={20} className="inline mr-1 text-yellow-400" />
            </span>
            <PixelInput
              type="text"
              placeholder={t("questBoard.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {isFilterOpen ? <X size={18} strokeWidth={2.5} /> : <ListFilter size={18} />}
              <span className={`hidden sm:inline ${fontClass}`}>
                {t("questBoard.filter")}
              </span>
            </PixelButton>

            {isFilterOpen && (
              <div className="absolute right-0 mt-3 w-[280px] bg-[#1a1a1a] pixel-border z-50 p-5 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <p
                      className={`font-pixel text-[10px] text-accent mb-3 uppercase border-b border-white/10 pb-1 ${fontClass}`}
                    >
                      {t("questBoard.queststatus")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatusFilter(s);
                          }}
                          className={`font-pixel text-[10px] px-2 py-1 border-2 transition-colors ${statusFilter === s
                            ? "border-gold text-gold bg-gold/10"
                            : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                            } ${fontClass}`}
                        >
                          {t(`questBoard.queststatuses.${s}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p
                      className={`font-pixel text-[10px] text-accent mb-3 uppercase border-b border-white/10 pb-1 ${fontClass}`}
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
                          className={`font-pixel text-[10px] px-2 py-1 border-2 transition-colors ${filter === cat
                            ? "border-gold text-gold bg-gold/10"
                            : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                            } ${fontClass}`}
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
                      onClick={() => {
                        setIsFilterOpen(false);
                      }}
                    >
                      <PixelSearch size={20} className="text-black" /> {t("questBoard.searchPlaceholder")}
                    </PixelButton>
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      className={`font-pixel flex-1 flex items-center justify-center gap-1 h-10 text-white ${fontClass}`}
                      onClick={() => {
                        setFilter("all");
                        setStatusFilter("active");
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
          {isSeniorOrEmployer() ? (
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
              {t("questBoard.found")}:{" "}
              <span className="text-accent">{filtered.length}</span>
            </p>
          )}
        </div>

        {/* --- Quest Grid & Loading States --- */}
        {isLoading ? (
          <div className="text-center py-20 animate-pulse font-pixel text-accent">
            {" "}
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
