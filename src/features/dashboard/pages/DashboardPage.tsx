import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useGetDashboard } from "../services/dashboard.service";
import DashboardHeader from "../components/DashboardHeader";
import KpiGrid from "../components/KpiGrid";
import TaskStatusBreakdown from "../components/TaskStatusBreakdown";
import RecentTasksTable from "../components/RecentTasksTable";

// ── Loading skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-4">
    <div className="h-16 bg-card pixel-border animate-pulse" />
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-card pixel-border animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2 h-40 bg-card pixel-border animate-pulse" />
      <div className="h-40 bg-card pixel-border animate-pulse" />
    </div>
    <div className="h-48 bg-card pixel-border animate-pulse" />
  </div>
);

// ── Error state ───────────────────────────────────────────────────────────────
const ErrorState = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="font-pixel text-[10px] text-destructive uppercase tracking-widest">
        {t("dashboard.error", "Failed to load dashboard")}
      </p>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = useGetDashboard();

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState />;

  const displayName = user?.nameEn || user?.nameTh || user?.username;

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <DashboardHeader role={data.role} username={displayName} />

      <KpiGrid data={data} />

      <TaskStatusBreakdown data={data} />

      <div>
        <p className="font-pixel text-[18px] text-muted-foreground uppercase tracking-widest mb-3">
          {t("dashboard.recentTasks", "Recent Tasks")}
        </p>
        <RecentTasksTable tasks={data.tasks} />
      </div>
    </div>
  );
};

export default DashboardPage;