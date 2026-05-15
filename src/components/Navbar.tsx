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
import PixelBell from "@/components/icons/PixelBell";
import PixelAdmin from "@/components/icons/PixelAdmin";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/store/notificationStore";
import { useThemeStore } from "@/store/themeStore";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, i18n } = useTranslation();
  const { notifications, markAllRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read && (!n.userId || n.userId === user?.id)).length;
  const { theme, toggleTheme } = useThemeStore();

  if (!user) return null;

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[18px]";
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
    { to: "/dashboard", label: t("navbar.dashboard", "Dashboard"), icon: <PixelClipboardList size={20} className="text-yellow-400" /> },
    { to: "/", label: t("navbar.quest_board", "Quest Board"), icon: <PixelClipboardList size={20} className="text-yellow-400" /> },
    { to: "/ranking", label: t("navbar.ranking", "Ranking"), icon: <PixelClipboardList size={20} className="text-yellow-400" /> },
    ...(isAdmin ? [{
      to: "/admin/managequest",
      label: t("navbar.admin"),
      icon: <PixelAdmin size={20} className="text-yellow-400" />,
    }] : []),
    { to: "/reward-shop", label: t("navbar.reward_shop", "Reward Shop"), icon: <PixelStore className="text-yellow-400" size={20} /> },
  ];

  return (
    <>
      <nav className={`bg-card pixel-border sticky top-0 z-50 ${fontClass}`}>
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">

          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
            <img
              src="/src/assets/iconquestinet.png"
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

            {/* Notification Bell */}
            <DropdownMenu onOpenChange={(open) => { if (open) markAllRead(); }}>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-foreground hover:text-accent transition-colors flex items-center justify-center">
                  <PixelBell size={24} className="text-yellow-400 relative z-10" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 rounded-full text-[9px] font-pixel text-white px-0.5 animate-pulse border-2 border-[#1a1c1e] z-20 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-card pixel-border border-accent/60 w-[300px] p-0 max-h-[380px] flex flex-col"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <span className="font-pixel text-[14px] uppercase tracking-wider text-accent">{t('navbar.notifications', 'Notifications')}</span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="font-pixel text-[14px] uppercase tracking-wider text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      {t('navbar.clearAll', 'Clear all')}
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.3)_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(245,158,11,0.3)] [&::-webkit-scrollbar-thumb]:rounded-none hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(245,158,11,0.6)]">
                  {notifications.filter(n => !n.userId || n.userId === user?.id).length === 0 ? (
                    <div className="px-3 py-6 text-center font-pixel text-[14px] text-muted-foreground uppercase">
                      {t('navbar.noNotifications', 'No notifications')}
                    </div>
                  ) : (
                    notifications
                      .filter(n => !n.userId || n.userId === user?.id)
                      .map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.questId) navigate(`/quest/${n.questId}`);
                        }}
                        className={`px-3 py-2.5 border-b border-border/60 flex flex-col gap-0.5 ${
                          !n.read ? 'bg-accent/5' : ''
                        } ${n.questId ? 'cursor-pointer hover:bg-accent/10 transition-colors' : ''}`}
                      >
                        <span className="font-pixel text-[14px] text-foreground leading-snug">
                          {n.i18nKey ? t(n.i18nKey, n.i18nParams) : n.message}
                        </span>
                        <span className="font-pixel text-[12px] text-muted-foreground">
                          {n.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User HUD Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="pixel-border bg-card flex flex-col min-w-[200px] overflow-hidden cursor-pointer hover:border-accent transition-colors duration-300 focus:outline-none">
                  {/* Header: Name */}
                  <div className="flex items-center justify-between px-2.5 py-1 bg-muted border-b border-border">
                    <span className="font-pixel text-[10px] text-muted-foreground truncate max-w-[160px] tracking-tight uppercase">
                      {i18n.language === "th" ? (user.nameTh || user.username) : (user.nameEn || user.username)}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-accent">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  
                  {/* Main Content: LV & Points */}
                  <div className="flex items-center justify-between px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center leading-none">
                        <span className="font-pixel text-[8px] text-muted-foreground -mb-0.5 uppercase">LV</span>
                        <span className="font-pixel text-[16px] text-foreground leading-none">
                          {user.level}
                        </span>
                      </div>
                      <ExpBar 
                        level={user.level} 
                        totalExp={user.totalExp || 0} 
                        size="sm" 
                        className="w-[70px]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-sm border border-border/40">
                      <PixelCoin size={14} className="text-accent drop-shadow-[0_0_2px_rgba(251,191,36,0.4)]" />
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={user.points}
                          initial={{ y: 5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          className="font-pixel text-accent text-[14px] leading-none tracking-wider"
                        >
                          {user.points.toLocaleString()}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-card pixel-border border-accent/60 min-w-[180px] p-1"
              >
                <DropdownMenuItem asChild className="font-pixel text-[16px] uppercase tracking-wider cursor-pointer hover:bg-accent/10 focus:bg-accent/10 text-foreground hover:text-accent focus:text-accent gap-2 px-3 py-2">
                  <Link to="/profile">
                    <PixelUser className="text-yellow-400" size={16} />
                    {t("navbar.profile", "Profile")}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border my-1" />

                <DropdownMenuItem
                  onClick={toggleLanguage}
                  className="font-pixel text-[16px] uppercase tracking-wider cursor-pointer hover:bg-accent/10 focus:bg-accent/10 text-foreground hover:text-accent focus:text-accent gap-2 px-3 py-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-yellow-400">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  {i18n.language === "th" ? "English" : "ภาษาไทย"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={toggleTheme}
                  className="font-pixel text-[16px] uppercase tracking-wider cursor-pointer hover:bg-accent/10 focus:bg-accent/10 text-foreground hover:text-accent focus:text-accent gap-2 px-3 py-2"
                >
                  {theme === "dark" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-yellow-400">
                      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-yellow-400">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  )}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border my-1" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="font-pixel text-[16px] uppercase tracking-wider cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 text-[#ef4444] hover:text-[#f87171] focus:text-[#f87171] gap-2 px-3 py-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="text-[#ef4444]">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  {t("navbar.logout", "Logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;