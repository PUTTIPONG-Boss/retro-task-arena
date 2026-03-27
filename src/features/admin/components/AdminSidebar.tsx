import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import PixelButton from "@/components/PixelButton";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // ดึงฟังก์ชัน logout มาใช้

  // รายการเมนูสำหรับ Admin
  const adminMenus = [
    { name: "👥 Manage Junior", path: "/manage/junior" },
    { name: "👥 Manage Senior", path: "/manage/senior" },
    { name: "📜 Manage Quests", path: "/manage/quest" },
    { name: "🎁 Manage Rewards", path: "/manage/reward" },
  ];

  return (
    <aside className="w-64 h-full flex-shrink-0 bg-[#121212] border-r-4 border-[#333] flex flex-col font-pixel">

      {/* --- ส่วนหัว Sidebar --- */}
      <div className="p-6 text-center border-b-4 border-[#333] bg-[#1a1a1b]">
        <h2 className="text-xl text-accent pixel-text-shadow mb-1">
          ⚔ ADMIN ⚔
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {adminMenus.map((menu) => {
          // ตรวจสอบว่าหน้าปัจจุบันตรงกับ path ของเมนูหรือไม่
          // Use strict equality for the root path to avoid it always being active
          const isActive = menu.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(menu.path);

          return (
            <Link key={menu.name} to={menu.path} className="block group">
              <div
                className={`px-4 py-3 border-2 transition-all duration-200 text-xs tracking-widest font-pixel ${isActive
                    ? "bg-accent/20 border-accent text-accent translate-x-1 shadow-[4px_4px_0px_0px_rgba(251,191,36,0.2)]"
                    : "bg-transparent border-transparent text-muted-foreground hover:bg-[#222] hover:border-[#444] hover:text-white group-hover:translate-x-1"
                  }`}
              >
                {menu.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* --- ส่วนท้าย (ปุ่ม Logout) --- */}
      <div className="p-4 border-t-4 border-[#333] bg-[#1a1a1b]">
        <PixelButton
          variant="ghost"
          size="md"
          className="w-full text-red-500 hover:text-red-400 hover:bg-red-900/20 text-xs tracking-wider"
          onClick={logout}
        >
          🚪 LOGOUT
        </PixelButton>
      </div>

    </aside>
  );
};

export default AdminSidebar;