import { useGetQuests } from "@/features/quests/services/quest.service";
import QuestCard from "@/features/quests/components/QuestCard";
import { useState } from "react";
import PixelButton from "@/components/PixelButton";
import PixelInput from '@/components/PixelInput'
// import PixelDivider from "@/components/PixelDivider";
import GuildBanner from "@/features/quests/components/GuildBanner";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

const QuestBoard = () => {
  const user = useAuthStore((s) => s.user);

  const { data: quests = [], isLoading, isError } = useGetQuests();
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isSeniorOrEmployer = () => {
    if (!user) return false;
    const r = user.role.toLowerCase();
    return r.includes('senior') || r === 'employer';
  };

  const categories = ["all", "FRONTEND", "BACKEND", "DEVOPS", "BUG FIX", "FEATURE"];

  const filtered = quests.filter((q) => {
    // 1. เช็คหมวดหมู่
    const catMatch = filter === "all" || q.category === filter;

    // 2. เช็คสถานะ
    const statusMatch =
      statusFilter === "all" ? true :
        statusFilter === "active" ? q.status !== "completed" :
          q.status === statusFilter;

    // 3. เช็คคำค้นหา (แปลงเป็นพิมพ์เล็กทั้งคู่ก่อนเทียบ จะได้หาเจอง่ายๆ)
    const searchMatch = searchQuery.trim() === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase());

    // 4. ต้องผ่านทั้ง 3 เงื่อนไข ถึงจะโชว์
    return catMatch && statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen">
      <GuildBanner />

      <div className="max-w-[1280px] mx-auto px-4 mt-6">

        {/* --- Top bar ที่ปรับปรุงใหม่ --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">

          {/* ซ้าย: หมวดหมู่ (Categories) - ให้ใช้พื้นที่ 1 ส่วน */}
          <div className="flex flex-wrap gap-2 w-full lg:flex-1 justify-center lg:justify-start">
            {categories.map((cat) => (
              <PixelButton
                key={cat}
                variant={filter === cat ? "gold" : "ghost"}
                size="sm"
                onClick={() => setFilter(cat)}
                className="uppercase"
              >
                {cat}
              </PixelButton>
            ))}
          </div>

          {/* กลาง: Search Bar - ใส่กรอบและสีให้ชัดเจน */}
          <div className="w-full lg:flex-[1.5] flex justify-center">
            <div className="w-full max-w-lg relative group">
              {/* ตกแต่งกรอบค้นหาให้เด่นขึ้นด้วย pixel-border และ bg สีเข้มขึ้นนิดนึง */}
              <div className="absolute inset-0 bg-background/50 pixel-border pointer-events-none transition-colors group-hover:border-accent"></div>

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm z-10">
                🔍
              </span>

              <PixelInput
                type="text"
                placeholder="Search quests by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 text-[10px] font-pixel relative z-0"
              />

              {/* ปุ่มเคลียร์คำค้นหา (โชว์เฉพาะตอนพิมพ์) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive z-10 font-pixel text-[8px]"
                >
                  [X]
                </button>
              )}
            </div>
          </div>

          {/* ขวา: สถานะ (Status) - ให้ใช้พื้นที่ 1 ส่วน */}
          <div className="flex gap-2 w-full lg:flex-1 justify-center lg:justify-end">
            {["active", "completed", "all"].map((s) => (
              <PixelButton
                key={s}
                variant={statusFilter === s ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className="uppercase"
              >
                {s}
              </PixelButton>
            ))}
          </div>

        </div>

        {/* Post Quest CTA */}
        <div className={`mb-6 flex items-center ${isSeniorOrEmployer() ? 'justify-between' : 'justify-end'}`}>
          {isSeniorOrEmployer() && (
            <Link to="/create-quest">
              <PixelButton variant="gold" size="md">
                📜 Post New Quest
              </PixelButton>
            </Link>
          )}

          {/* แสดงจำนวนผลลัพธ์การค้นหา */}
          {searchQuery && (
            <p className="font-pixel text-[8px] text-muted-foreground">
              Found: <span className="text-accent">{filtered.length}</span> quests
            </p>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="font-pixel text-[12px] text-accent pixel-text-shadow animate-pulse">
              Summoning quests from the backend realm...
            </p>
          </div>
        )}

        {isError && (
          <div className="text-center py-20 border-2 border-destructive p-4 mt-4 bg-destructive/10">
            <p className="font-pixel text-[12px] text-destructive pixel-text-shadow">
              Failed to connect to the backend API.
            </p>
            <p className="text-lg text-muted-foreground mt-2">Is the Go Fiber server running on port 5000?</p>
          </div>
        )}

        {/* Quest Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filtered.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && !isError && (
          <div className="text-center py-20">
            <p className="font-pixel text-[12px] text-muted-foreground pixel-text-shadow">
              No quests found in this realm...
            </p>
            {/* กรณีค้นหาไม่เจอ */}
            <div className="text-center py-20 pixel-border bg-secondary/50">
              <span className="text-4xl mb-4 block">👻</span>
              <p className="font-pixel text-[12px] text-muted-foreground pixel-text-shadow mb-4">
                No quests found matching your criteria...
              </p>
              <button
                onClick={() => { setSearchQuery(""); setFilter("all"); setStatusFilter("active"); }}
                className="font-pixel text-[10px] text-accent hover:text-foreground transition-colors"
              >
                [ CLEAR ALL FILTERS ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestBoard;