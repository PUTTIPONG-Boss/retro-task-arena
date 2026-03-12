import { Link, useLocation } from "react-router-dom";
import { mockUser } from "@/data/mockData";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Quest Board", icon: "📋" },
    { to: "/reward-shop", label: "Reward Shop", icon: "🏪" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="bg-card pixel-border sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-pixel text-[12px] text-accent pixel-text-shadow tracking-wide">
          ⚔ QUEST BOARD
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

          <div className="pixel-border bg-secondary px-3 py-1 flex items-center gap-2">
            <span className="text-lg">🪙</span>
            <span className="font-pixel text-[10px] text-accent pixel-text-shadow">
              {mockUser.points.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
