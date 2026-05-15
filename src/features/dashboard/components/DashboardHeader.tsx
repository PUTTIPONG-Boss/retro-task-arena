import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/store/themeStore";

interface DashboardHeaderProps {
  role: "ADMIN" | "JUNIOR" | "SENIOR";
  username?: string;
}

const roleLabel: Record<string, string> = {
  ADMIN: "ADMIN",
  SENIOR: "SENIOR",
  JUNIOR: "JUNIOR",
};

const roleDotColor: Record<string, Record<string, string>> = {
  ADMIN:  { dark: "bg-red-400",     light: "bg-red-700"     },
  SENIOR: { dark: "bg-accent",      light: "bg-amber-700"   },
  JUNIOR: { dark: "bg-emerald-400", light: "bg-emerald-700" },
};

const roleTextColor: Record<string, Record<string, string>> = {
  ADMIN:  { dark: "text-red-400 border-red-400/40",         light: "text-red-700 border-red-700/50"         },
  SENIOR: { dark: "text-accent border-accent/40",           light: "text-amber-700 border-amber-700/50"     },
  JUNIOR: { dark: "text-emerald-400 border-emerald-400/40", light: "text-emerald-700 border-emerald-700/50" },
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ role, username }) => {
  const { i18n } = useTranslation();
  const isTh = i18n.language === "th";
  const { theme } = useThemeStore();
  const isLight = theme === "light";

  const now = new Date();
  const dateStr = now.toLocaleDateString(isTh ? "th-TH" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 border-b border-border pb-5">
      {/* Left: greeting + name */}
      <div>
        <p className="font-pixel text-[18px] text-muted-foreground uppercase tracking-[0.25em] mb-2">
          {greeting}
        </p>
        <h1
          className={`font-pixel pixel-text-shadow uppercase text-[20px] ${
            isLight ? "text-foreground" : "text-white"
          }`}
        >
          {username ?? "Adventurer"}
        </h1>
      </div>

      {/* Right: role badge + live date */}
      <div className="flex flex-col items-start sm:items-end gap-1.5">
        <div
          className={`flex items-center gap-2 border px-3 py-1 ${roleTextColor[role][isLight ? "light" : "dark"]}`}
        >
          <span className={`w-2 h-2 ${roleDotColor[role][isLight ? "light" : "dark"]} animate-pulse`} />
          <span className="font-pixel text-[18px] tracking-widest">
            {roleLabel[role]}
          </span>
        </div>
        <p className="font-pixel-body text-muted-foreground text-[20px]">
          {dateStr}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;