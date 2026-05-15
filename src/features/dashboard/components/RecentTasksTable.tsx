import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PixelButton from "@/components/PixelButton";
import PixelCoin from "@/components/icons/PixelCoin";
import { DashboardTask } from "../types";
import { cn } from "@/lib/utils";

interface RecentTasksTableProps {
  tasks: DashboardTask[];
}

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  OPEN:        { label: "dashboard.status.open",        color: "text-emerald-400", dotColor: "bg-emerald-400" },
  IN_PROGRESS: { label: "dashboard.status.inProgress", color: "text-blue-400",    dotColor: "bg-blue-400"    },
  COMPLETED:   { label: "dashboard.status.completed",  color: "text-accent",      dotColor: "bg-accent"      },
  REVIEW:      { label: "dashboard.status.inReview",   color: "text-purple-400",  dotColor: "bg-purple-400"  },
};

const difficultyConfig: Record<string, string> = {
  EASY:   "text-emerald-400",
  MEDIUM: "text-yellow-400",
  HARD:   "text-red-400",
};

const RecentTasksTable: React.FC<RecentTasksTableProps> = ({ tasks }) => {
  const { t, i18n } = useTranslation();
  const isTh = i18n.language === "th";

  if (tasks.length === 0) {
    return (
      <div className="bg-card pixel-border p-8 text-center">
        <p className={`font-pixel-body text-muted-foreground ${isTh ? "text-[20px]" : "text-[18px]"}`}>
          {t("dashboard.noTasks", "No recent tasks")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card pixel-border overflow-hidden">

      {/* Rows */}
      <div className="divide-y divide-border">
        {tasks.map((task) => {
          const status = statusConfig[task.status] ?? statusConfig["OPEN"];
          const diffColor = difficultyConfig[task.difficulty] ?? "text-muted-foreground";

          return (
            <div
              key={task.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 px-4 py-3 items-center hover:bg-secondary/40 transition-colors"
            >
              {/* Title + status dot + skills */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`font-pixel-body text-white truncate ${isTh ? "text-[18px]" : "text-[16px]"}`}>
                    {task.title}
                  </p>
                  <span className={cn("font-pixel text-[10px] px-1.5 py-0.5 border uppercase", status.color, "border-current bg-current/5")}>
                    {t(status.label)}
                  </span>
                </div>
                <p className="font-pixel-body text-muted-foreground text-[16px] truncate pl-4">
                  {task.skills}
                </p>
              </div>

              {/* WorkType */}
              <span
                className={cn(
                  "font-pixel text-[14px] px-2 py-1 border flex-shrink-0",
                  task.workType === "TEAM"
                    ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
                    : "text-muted-foreground border-border bg-secondary"
                )}
              >
                {task.workType}
              </span>

              {/* Difficulty */}
              <span className={`font-pixel text-[14px] flex-shrink-0 ${diffColor}`}>
                {task.difficulty}
              </span>

              {/* Points */}
              <span className="flex items-center gap-1 font-pixel text-[14px] text-accent flex-shrink-0">
                <PixelCoin size={11} className="text-accent" />
                {task.point}
              </span>

              {/* View link */}
              <Link to={`/quest/${task.id}`} className="flex-shrink-0">
                <PixelButton size="sm" variant="ghost" className="text-[14px] px-2 py-1">
                  {t("dashboard.view", "View")}
                </PixelButton>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTasksTable;