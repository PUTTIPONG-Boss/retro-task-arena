import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import { useAuthStore } from "@/features/auth/store/authStore";

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

  const links = [
    { to: "/", label: "Quest Board", icon: "📋" },
    { to: "/create-quest", label: "Post Quest", icon: "📜" },
    { to: "/reward-shop", label: "Reward Shop", icon: "🏪" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="bg-card pixel-border sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-pixel text-[12px] text-accent pixel-text-shadow tracking-wide flex items-center gap-2">
          <span>⚔</span>
          <span>QUEST BOARD</span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-pixel text-[9px] uppercase tracking-wider transition-none ${
                location.pathname === link.to
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
              <span className="font-pixel text-[10px] text-accent pixel-text-shadow">
                {user.points.toLocaleString()}
              </span>
            </div>
            <div className="w-[1px] h-4 bg-border" />
            <span className="font-pixel text-[8px] text-foreground hidden md:inline">
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="font-pixel text-[7px] text-destructive hover:text-destructive/80 uppercase tracking-wider cursor-pointer"
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
