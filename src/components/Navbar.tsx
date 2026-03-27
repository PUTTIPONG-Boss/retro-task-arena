import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PixelButton from "@/components/PixelButton";
import { playPageTurnSound } from "@/lib/sound/pageTurnSound";
import PixelStore from "@/components/icons/PixelStore";
import PixelUser from "@/components/icons/PixelUser";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import PixelSword from "@/components/icons/PixelSword";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, i18n } = useTranslation();

  if (!user) return null;

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[18px]";
  const isAdmin = user.role === "ADMIN";

  const toggleLanguage = () => {
    playPageTurnSound();
    const newLang = i18n.language === "th" ? "en" : "th";
    i18n.changeLanguage(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const handleLogout = () => {
    playPageTurnSound();
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", label: t("navbar.quest_board", "Quest Board"), icon: <PixelClipboardList size={20} className="text-yellow-400" /> },
    ...(isAdmin ? [{ 
      to: "/manage/quest", 
      label: t("navbar.admin"), 
      icon: <PixelSword size={20} bladeColor="#ff5555" hiltColor="#440000" guardColor="#aa0000" /> 
    }] : []),
    { to: "/reward-shop", label: t("navbar.reward_shop", "Reward Shop"), icon: <PixelStore className="text-yellow-400" size={20} /> },
    { to: "/profile", label: t("navbar.profile", "Profile"), icon: <PixelUser className="text-yellow-400" size={20} /> },
  ];

  return (
    <>
      <nav className={`bg-card pixel-border sticky top-0 z-50 ${fontClass}`}>
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">

          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2" onClick={playPageTurnSound}>
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
                onClick={playPageTurnSound}
                className={`flex items-center gap-2 font-pixel ${fontClass} uppercase tracking-wider transition-none ${location.pathname === link.to
                    ? "text-accent pixel-text-shadow"
                    : "text-foreground hover:text-accent"
                  }`}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}

            {/* User HUD */}
            <div className="pixel-border bg-secondary px-3 py-1 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className={`font-pixel text-muted-foreground ${fontClass}`}>
                  LV
                </span>
                <span className={`font-pixel text-foreground ${fontClass}`}>
                  {user.level}
                </span>
              </div>
              <div className="w-[1px] h-4 bg-border" />
              <div className="flex items-center gap-1">
                <PixelCoin className="text-yellow-400 -mt-0.5" size={20} />
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={user.points}
                    initial={{ y: 10, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      duration: 0.3
                    }}
                    className={`font-pixel text-accent pixel-text-shadow inline-block ${fontClass}`}
                  >
                    {user.points.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="w-[1px] h-4 bg-border" />
              <span className={`font-pixel text-foreground hidden md:inline ${fontClass}`}>
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="font-pixel text-destructive hover:text-destructive/80 uppercase tracking-wider cursor-pointer"
              >
                ⏻
              </button>
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