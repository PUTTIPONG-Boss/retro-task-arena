import { useTranslation } from "react-i18next";

interface DashboardHeaderProps {
  role: "ADMIN" | "JUNIOR" | "SENIOR";
  username?: string;
}

const roleLabel: Record<string, string> = {
  ADMIN: "ADMIN",
  SENIOR: "SENIOR",
  JUNIOR: "JUNIOR",
};

const roleDotColor: Record<string, string> = {
  ADMIN: "bg-red-400",
  SENIOR: "bg-accent",
  JUNIOR: "bg-emerald-400",
};

const roleTextColor: Record<string, string> = {
  ADMIN: "text-red-400 border-red-400/40",
  SENIOR: "text-accent border-accent/40",
  JUNIOR: "text-emerald-400 border-emerald-400/40",
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ role, username }) => {
  const { i18n } = useTranslation();
  const isTh = i18n.language === "th";

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
          className={`font-pixel pixel-text-shadow text-white uppercase ${
            isTh ? "text-[20px]" : "text-[20px]"
          }`}
        >
          {username ?? "Adventurer"}
        </h1>
      </div>

      {/* Right: role badge + live date */}
      <div className="flex flex-col items-start sm:items-end gap-1.5">
        <div
          className={`flex items-center gap-2 border px-3 py-1 ${roleTextColor[role]}`}
        >
          <span className={`w-2 h-2 ${roleDotColor[role]} animate-pulse`} />
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