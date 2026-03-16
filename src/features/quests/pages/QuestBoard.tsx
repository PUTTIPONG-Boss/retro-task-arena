import { useGetQuests } from "@/features/quests/services/quest.service";
import QuestCard from "@/features/quests/components/QuestCard";
import { useState } from "react";
import PixelButton from "@/components/PixelButton";
import PixelInput from '@/components/PixelInput'
// import PixelDivider from "@/components/PixelDivider";
// import GuildBanner from "@/features/quests/components/GuildBanner";
import { Link } from "react-router-dom";

const QuestBoard = () => {
  const { data: quests = [], isLoading, isError } = useGetQuests();
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      {/* Hero */}
      <div className="relative w-full h-[200px] overflow-hidden pixel-border bg-secondary">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <h1 className="font-pixel text-[18px] sm:text-[22px] text-accent pixel-text-shadow text-center leading-relaxed">
            ⚔ Quest Board
          </h1>
          <p className="font-pixel text-[10px] text-foreground pixel-text-shadow">
            Accept quests. Earn gold. Level up.
          </p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="animate-blink-star text-accent" style={{ animationDelay: `${i * 0.4}s` }}>
                ✦
              </span>
            ))}
          </div>
        </div>
      </div>

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
        <div className="mb-6 flex justify-between items-center">
          <Link to="/create-quest">
            <PixelButton variant="gold" size="md">
              📜 Post New Quest
            </PixelButton>
          </Link>

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

        {/* กรณีค้นหาไม่เจอ */}
        {filtered.length === 0 && (
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
        )}
      </div>
    </div >
  );
};

export default QuestBoard;