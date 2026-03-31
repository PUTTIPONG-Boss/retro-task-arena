import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useAuth";
import PixelButton from "@/components/PixelButton";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import PixelStore from "@/components/icons/PixelStore";
import { useMemo } from "react";

const AdminSidebar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-accent flex-shrink-0"><path d="M2 22H0v-4h2v4Zm14 0h-2v-4h2v4Zm8 0h-2v-4h2v4ZM4 18H2v-2h2v2Zm10 0h-2v-2h2v2Zm8 0h-2v-2h2v2Zm-10-2H4v-2h8v2Zm8 0h-4v-2h4v2Zm-9-4H5v-2h6v2Zm8 0h-4v-2h4v2ZM5 10H3V4h2v6Zm8 0h-2V4h2v6Zm8 0h-2V4h2v6ZM11 4H5V2h6v2Zm8 0h-4V2h4v2Z"/></svg>
  );

  // รายการเมนูสำหรับ Admin
  const adminMenus = useMemo(() => [
    { icon: <BuildingIcon />, label: t("sidebar.junior"), path: "/admin/managejunior" },
    { icon: <BuildingIcon />, label: t("sidebar.senior"), path: "/admin/managesenior" },
    { icon: <PixelClipboardList className="w-5 h-5 flex-shrink-0 text-accent" />, label: t("sidebar.quest"), path: "/admin/managequest" },
    { icon: <PixelStore className="w-5 h-5 flex-shrink-0 text-accent" />, label: t("sidebar.reward"), path: "/admin/managereward" },
  ], [t]);

  return (
    <aside className="w-64 h-full flex-shrink-0 bg-[#121212] border-r-4 border-[#333] flex flex-col font-pixel">

      {/* --- ส่วนหัว Sidebar --- */}
      <div className="p-6 text-center border-b-4 border-[#333] bg-[#1a1a1b]">
        <h2 className="text-xl text-accent pixel-text-shadow mb-1">
          ⚔ {t("sidebar.admin")} ⚔
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
            <Link key={menu.path} to={menu.path} className="block group">
              <div
                className={`flex items-center gap-2 px-4 py-3 border-2 transition-all duration-200 tracking-widest font-pixel ${fontClass} ${isActive
                  ? "bg-accent/20 border-accent text-accent translate-x-1 shadow-[4px_4px_0px_0px_rgba(251,191,36,0.2)]"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-[#222] hover:border-[#444] hover:text-white group-hover:translate-x-1"
                  }`}
              >
                {menu.icon}
                {menu.label}
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
          className={`w-full text-red-500 hover:text-red-400 hover:bg-red-900/20 tracking-wider ${fontClass}`}
          onClick={logout}
        >
          🚪 {t("sidebar.logout")}
        </PixelButton>
      </div>

    </aside>
  );
};

export default AdminSidebar;