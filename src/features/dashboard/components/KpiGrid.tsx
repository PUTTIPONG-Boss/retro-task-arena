import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelStar from "@/components/icons/PixelStar";
import PixelHourglass from "@/components/icons/PixelHourglass";
import PixelFlag from "@/components/icons/PixelFlag";
import PixelUsers from "@/components/icons/PixelUsers";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import PixelGem from "@/components/icons/PixelGem";
import { DashboardData } from "../types";

// ── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  valueColor?: string;
  size?: "normal" | "large";
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  icon,
  valueColor = "text-white",
  size = "normal",
}) => (
  <div className="bg-card pixel-border p-5 relative overflow-hidden group hover:bg-white/[0.03] transition-colors">
    {/* Watermark icon */}
    <div className="absolute right-4 bottom-3 opacity-[0.08] pointer-events-none group-hover:opacity-[0.14] transition-opacity">
      {icon}
    </div>

    <p className="font-pixel text-[18px] text-muted-foreground uppercase tracking-widest mb-3">
      {label}
    </p>

    <p
      className={cn(
        "font-pixel pixel-text-shadow leading-none mb-2",
        valueColor,
        size === "large" ? "text-[28px] sm:text-[36px]" : "text-[22px] sm:text-[28px]"
      )}
    >
      {value}
    </p>

    {subtext && (
      <p className="font-pixel-body text-muted-foreground text-[14px]">
        {subtext}
      </p>
    )}
  </div>
);

// ── KPI Grid ──────────────────────────────────────────────────────────────────
interface KpiGridProps {
  data: DashboardData;
}

const KpiGrid: React.FC<KpiGridProps> = ({ data }) => {
  const { t } = useTranslation();
  const isAdmin = data.role === "ADMIN";
  const isSeniorOrAdmin = data.role === "SENIOR" || data.role === "ADMIN";

  return (
    <div className="mb-6">
      {/* ── Row 1: Primary KPIs ──────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {/* Point Balance — all roles */}
        {data.pointBalance !== undefined && (
          <KpiCard
            label={t("dashboard.pointBalance", "Point Balance")}
            value={data.pointBalance.toLocaleString()}
            subtext={t("dashboard.pointBalanceSub", "Available to spend")}
            icon={<PixelCoin size={64} className="text-accent" />}
            valueColor="text-accent"
          />
        )}

        {/* Completed Tasks — all roles */}
        <KpiCard
          label={t("dashboard.completedTasks", "Quests Completed")}
          value={data.completedTasksCount}
          subtext={t("dashboard.completedTasksSub", "Finished adventures")}
          icon={<PixelTrophy size={64} className="text-accent" />}
          valueColor="text-accent"
        />

        {/* In Progress — all roles */}
        <KpiCard
          label={t("dashboard.inProgress", "In Progress")}
          value={data.inProgressTasksCount}
          subtext={t("dashboard.inProgressSub", "Currently active")}
          icon={<PixelHourglass size={64} className="text-blue-400" />}
          valueColor="text-blue-400"
        />

        {/* Total EXP — all roles */}
        <KpiCard
          label={t("dashboard.totalExp", "Total EXP")}
          value={data.totalExp.toLocaleString()}
          subtext={`Lv. ${data.level}`}
          icon={<PixelGem size={64} className="text-purple-400" />}
          valueColor="text-purple-400"
        />
      </div>

      {/* ── Row 2: Secondary KPIs ───────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Open Tasks — SENIOR & ADMIN */}
        {isSeniorOrAdmin && data.openTasksCount !== undefined && (
          <KpiCard
            label={t("dashboard.openTasks", "Open Quests")}
            value={data.openTasksCount}
            subtext={t("dashboard.openTasksSub", "Awaiting adventurers")}
            icon={<PixelFlag size={64} className="text-emerald-400" />}
            valueColor="text-emerald-400"
          />
        )}

        {/* Rating — all roles */}
        <KpiCard
          label={t("dashboard.rating", "Rating")}
          value={`${data.rating} / 5`}
          subtext={`${t("dashboard.ratingAvg", "Avg. score")}`}
          icon={<PixelStar size={64} className="text-accent" />}
          valueColor="text-accent"
        />

        {/* Total Ratings — only for non-admins */}
        {!isAdmin && (
          <KpiCard
            label={t("dashboard.totalRatings", "Total Ratings")}
            value={data.totalRatings}
            subtext={t("dashboard.totalRatingsSub", "Reviews received")}
            icon={<PixelStar size={64} className="text-yellow-400" />}
            valueColor="text-yellow-400"
          />
        )}

        {/* Total Users — ADMIN only */}
        {isAdmin && data.totalUsersCount !== undefined && (
          <KpiCard
            label={t("dashboard.totalUsers", "Guild Members")}
            value={data.totalUsersCount}
            subtext={t("dashboard.totalUsersSub", "Registered users")}
            icon={<PixelUsers size={64} className="text-red-400" />}
            valueColor="text-red-400"
          />
        )}

        {/* Total Tasks — ADMIN only */}
        {isAdmin && data.totalTasksCount !== undefined && (
          <KpiCard
            label={t("dashboard.totalTasks", "Total Quests")}
            value={data.totalTasksCount}
            subtext={t("dashboard.totalTasksSub", "All time posted")}
            icon={<PixelClipboardList size={64} className="text-red-400" />}
            valueColor="text-red-400"
          />
        )}
      </div>
    </div>
  );
};

export default KpiGrid;