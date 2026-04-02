import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PixelButton from "@/components/PixelButton";
import ExpBar from "@/components/ExpBar";
import PixelStore from "@/components/icons/PixelStore";
import PixelUser from "@/components/icons/PixelUser";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import PixelSword from "@/components/icons/PixelSword";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, i18n } = useTranslation();

  if (!user) return null;

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[14px]";
  const isAdmin = user.role === "ADMIN";

  const toggleLanguage = () => {
    const newLang = i18n.language === "th" ? "en" : "th";
    i18n.changeLanguage(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", label: t("navbar.quest_board", "Quest Board"), icon: <PixelClipboardList size={20} className="text-yellow-400" /> },
    ...(isAdmin ? [{
      to: "/admin/managequest",
      label: t("navbar.admin"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="text-yellow-400" width={20} height={20}>
          <path d="M6 22H4v-4h2v4Zm12 0h-2v-2h2v2Zm4 0h-2v-2h2v2Zm-2-2h-2v-2h2v2ZM8 18H6v-2h2v2Zm10 0h-2v-2h2v2Zm4 0h-2v-2h2v2Zm-8-2H8v-2h6v2Zm1-4H9v-2h6v2Zm-6-2H7V4h2v6Zm8 0h-2V4h2v6Zm-2-6H9V2h6v2Z" />
        </svg>
      ),
    }] : []),
    { to: "/reward-shop", label: t("navbar.reward_shop", "Reward Shop"), icon: <PixelStore className="text-yellow-400" size={20} /> },
    { to: "/profile", label: t("navbar.profile", "Profile"), icon: <PixelUser className="text-yellow-400" size={20} /> },
  ];

  return (
    <>
      <nav className={`bg-card pixel-border sticky top-0 z-50 ${fontClass}`}>
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">

          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
            <img
              src="/src/assets/logoinetquest.png"
              alt="INETQUEST"
              className="h-10 w-auto"
              style={{
                imageRendering: "pixelated",
                filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.5))",
                width: "100px",
                height: "80px",
              }}
            />
          </Link>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 font-pixel ${fontClass} uppercase tracking-wider transition-none ${(link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to.startsWith("/admin") ? "/admin" : link.to))
                    ? "text-accent pixel-text-shadow"
                    : "text-foreground hover:text-accent"
                  }`}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}

            {/* User HUD - RPG Status Plate Redesign */}
            <div className="pixel-border bg-[#1a1c1e] flex flex-col min-w-[200px] overflow-hidden group hover:border-[#F59E0B] transition-colors duration-300">
              {/* Header: Name & Logout */}
              <div className="flex items-center justify-between px-2.5 py-1 bg-[#141517] border-b border-slate-800">
                <span className="font-pixel text-[10px] text-[#9ca3af] truncate max-w-[140px] tracking-tight uppercase">
                  {i18n.language === "th" ? (user.nameTh || user.username) : (user.nameEn || user.username)}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-pixel text-[#ef4444] hover:text-[#f87171] transition-colors text-[10px] opacity-60 group-hover:opacity-100"
                >
                  LOGOUT
                </button>
              </div>
              
              {/* Main Content: LV & Points */}
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <div className="flex items-center gap-1.5 focus:outline-none">
                  <div className="flex flex-col items-center leading-none">
                    <span className="font-pixel text-[8px] text-[#6b7280] -mb-0.5 uppercase">LV</span>
                    <span className="font-pixel text-[16px] text-white leading-none">
                      {user.level}
                    </span>
                  </div>
                  
                  {/* EXP Bar - Inline but prominent */}
                  <ExpBar 
                    level={user.level} 
                    totalExp={user.totalExp || 0} 
                    size="sm" 
                    className="w-[70px]"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-[#141517]/50 px-2 py-1 rounded-sm border border-slate-800/50">
                  <PixelCoin size={14} className="text-[#fbbf24] drop-shadow-[0_0_2px_rgba(251,191,36,0.4)]" />
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={user.points}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="font-pixel text-[#f59e0b] text-[14px] leading-none tracking-wider"
                    >
                      {user.points.toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <PixelButton
              onClick={toggleLanguage}
              variant="ghost"
              size="sm"
              className="font-pixel text-[11px] min-w-[50px]"
            >
              {i18n.language === "th" ? "ENG" : "TH"}
            </PixelButton>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;