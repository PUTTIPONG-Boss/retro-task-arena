import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useAuth";
import PixelButton from "@/components/PixelButton";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import PixelStore from "@/components/icons/PixelStore";
import PixelBuilding from "@/components/icons/PixelBuilding";
import { useMemo } from "react";
import { useThemeStore } from "@/store/themeStore";

const AdminSidebar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme } = useThemeStore();
  const isLight = theme === "light";

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const bg = isLight ? "bg-[#C8BA98]" : "bg-[#121212]";
  const headerBg = isLight ? "bg-[#B8A880]" : "bg-[#1a1a1b]";
  const borderColor = isLight ? "border-[#8B5A20]" : "border-[#333]";
  const hoverBg = isLight ? "hover:bg-[#A89870]" : "hover:bg-[#222]";
  const hoverBorder = isLight ? "hover:border-[#8B5A20]" : "hover:border-[#444]";
  const hoverText = isLight ? "hover:text-foreground" : "hover:text-white";

  // รายการเมนูสำหรับ Admin
  const adminMenus = useMemo(() => [
    { icon: <PixelBuilding size={20} className="flex-shrink-0 opacity-80" />, label: t("sidebar.junior"), path: "/admin/managejunior" },
    { icon: <PixelBuilding size={20} className="flex-shrink-0 opacity-80" />, label: t("sidebar.senior"), path: "/admin/managesenior" },
    { icon: <PixelClipboardList className="w-5 h-5 flex-shrink-0 opacity-80" />, label: t("sidebar.quest"), path: "/admin/managequest" },
    { icon: <PixelStore className="w-5 h-5 flex-shrink-0 opacity-80" />, label: t("sidebar.reward"), path: "/admin/managereward" },
    { icon: <PixelClipboardList className="w-5 h-5 flex-shrink-0 opacity-80" />, label: t("sidebar.order"), path: "/admin/manageorder" },
  ], [t]);

  return (
    <aside className={`w-64 h-full flex-shrink-0 ${bg} border-r-4 ${borderColor} flex flex-col font-pixel`}>

      {/* --- ส่วนหัว Sidebar --- */}
      <div className={`p-6 text-center border-b-4 ${borderColor} ${headerBg}`}>
        <h2 className="text-xl pixel-text-shadow mb-1" style={{ color: isLight ? "#3D1C08" : undefined }}>
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
                  ? isLight
                    ? "bg-[#3D1C08] border-[#3D1C08] text-[#F5E6D0] translate-x-1 shadow-[4px_4px_0px_0px_rgba(61,28,8,0.35)]"
                    : "bg-accent/20 border-accent text-accent translate-x-1 shadow-[4px_4px_0px_0px_rgba(251,191,36,0.2)]"
                  : `bg-transparent border-transparent ${hoverBg} ${hoverBorder} ${hoverText} group-hover:translate-x-1`
                  }`}
                style={!isActive && isLight ? { color: "#3D1C08" } : undefined}
              >
                {menu.icon}
                {menu.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* --- ส่วนท้าย (ปุ่ม Logout) --- */}
      <div className={`p-4 border-t-4 ${borderColor} ${headerBg}`}>
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