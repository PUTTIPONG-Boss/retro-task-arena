import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((s) => s.logout);
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isSeniorOrEmployer = (role: string) => {
    const r = role.toLowerCase();
    return r.includes('senior') || r === 'employer';
  };

  const links = [
    { to: "/", label: "Quest Board", icon: "📋" },
    { to: "/create-quest", label: "Post Quest", icon: "📜", roles: ["employer"] },
    { to: "/reward-shop", label: "Reward Shop", icon: "🏪" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  const filteredLinks = links.filter((link) => {
    if (!link.roles) return true;
    return link.roles.some(r => {
      if (r === 'employer') return isSeniorOrEmployer(user.role);
      return user.role === r;
    });
  });

  return (
    <nav className="bg-card pixel-border sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
          <img
            src="/src/assets/logoinetquest.png"
            alt="INETQUEST"
            className="h-10 w-auto"
            style={{
              imageRendering: 'pixelated', // สำคัญมาก: ทำให้พิกเซลไม่เบลอ
              filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))',
              width: '100px',
              height: '80px',
            }}
          />
        </Link>

        <div className="flex items-center gap-6">
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-pixel text-[9px] uppercase tracking-wider transition-none ${location.pathname === link.to
                ? "text-accent pixel-text-shadow"
                : "text-foreground hover:text-accent"
                }`}
            >
              <span className="mr-1">{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}

          {/* User HUD */}
          <div className="pixel-border bg-secondary px-3 py-1 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-pixel text-[7px] text-muted-foreground">LV</span>
              <span className="font-pixel text-[10px] text-foreground">{user.level}</span>
            </div>
            <div className="w-[1px] h-4 bg-border" />
            <div className="flex items-center gap-1">
              <span className="text-lg">🪙</span>
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
                  className="font-pixel text-[10px] text-accent pixel-text-shadow inline-block"
                >
                  {user.points.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="w-[1px] h-4 bg-border" />
            <span className="font-pixel text-[8px] text-foreground hidden md:inline">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="font-pixel text-[10px] text-destructive hover:text-destructive/80 uppercase tracking-wider cursor-pointer"
            >
              ⏻
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
