import { useTranslation } from "react-i18next";
import { DashboardData } from "../types";
import { useThemeStore } from "@/store/themeStore";

interface TaskStatusBreakdownProps {
  data: DashboardData;
}

interface Segment {
  label: string;
  count: number;
  color: string;       // tailwind text color
  stroke: string;      // SVG stroke color (hex/hsl)
  squareColor: string; // tailwind bg for the legend square
}

// ── Donut helpers ─────────────────────────────────────────────────────────────
const R = 70;          // radius
const STROKE = 22;     // ring thickness
const CX = 100;        // centre x (viewBox 200×200)
const CY = 100;        // centre y
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP = 3;         // gap in px between segments (degrees of arc skipped)

function buildArcs(segments: Segment[], total: number) {
  let offset = 0; // dashoffset so far (in px along the circle)

  return segments.map((seg) => {
    const pct = total > 0 ? seg.count / total : 0;
    const arcLength = CIRCUMFERENCE * pct;
    // Reduce arc slightly to create a visible gap
    const visibleArc = Math.max(0, arcLength - GAP);
    const dashArray = `${visibleArc} ${CIRCUMFERENCE - visibleArc}`;
    const dashOffset = -(offset);
    offset += arcLength;
    return { ...seg, dashArray, dashOffset };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
const TaskStatusBreakdown: React.FC<TaskStatusBreakdownProps> = ({ data }) => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isLight = theme === "light";

  const segments: Segment[] = [
    {
      label: t("dashboard.status.completed", "Completed"),
      count: data.completedTasksCount,
      color: "text-accent",
      stroke: "hsl(45 80% 55%)",   // --accent
      squareColor: "bg-accent",
    },
    {
      label: t("dashboard.status.inProgress", "In Progress"),
      count: data.inProgressTasksCount,
      color: "text-blue-400",
      stroke: "#60a5fa",
      squareColor: "bg-blue-400",
    },
    ...(data.openTasksCount !== undefined
      ? [
          {
            label: t("dashboard.status.open", "Open"),
            count: data.openTasksCount!,
            color: "text-emerald-400",
            stroke: "#34d399",
            squareColor: "bg-emerald-400",
          },
        ]
      : []),
  ];

  const total = segments.reduce((s, seg) => s + seg.count, 0);
  const arcs = buildArcs(segments, total);

  return (
    <div className="bg-card pixel-border p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className={`font-pixel text-[18px] text-foreground uppercase tracking-widest ${isLight ? "pixel-text-shadow" : ""}`}>
          {t("dashboard.taskBreakdown", "Task Breakdown")}
        </p>
        <p className={`font-pixel text-[18px] text-muted-foreground ${isLight ? "pixel-text-shadow" : ""}`}>
          {total} {t("dashboard.total", "total")}
        </p>
      </div>

      {/* Body: donut left, legend right */}
      <div className="flex flex-col sm:flex-row items-center gap-8">

        {/* ── Donut SVG ── */}
        <div
          className="relative flex-shrink-0 w-[220px] h-[220px]"
          style={isLight ? { filter: "drop-shadow(3px 4px 0px rgba(45,18,5,0.22))" } : undefined}
        >
          <svg
            viewBox="0 0 200 200"
            width="220"
            height="220"
            style={{ imageRendering: "pixelated", transform: "rotate(-90deg)" }}
          >
            {/* Track ring */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={isLight ? "hsl(38 25% 72%)" : "hsl(0 0% 10%)"}
              strokeWidth={STROKE}
            />

            {total === 0 ? (
              /* Empty state: single grey ring */
              <circle
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={isLight ? "hsl(38 20% 78%)" : "hsl(0 0% 18%)"}
                strokeWidth={STROKE}
                strokeDasharray={`${CIRCUMFERENCE} 0`}
              />
            ) : (
              arcs.map((arc) => (
                <circle
                  key={arc.label}
                  cx={CX} cy={CY} r={R}
                  fill="none"
                  stroke={arc.stroke}
                  strokeWidth={STROKE}
                  strokeDasharray={arc.dashArray}
                  strokeDashoffset={arc.dashOffset}
                  strokeLinecap="butt"
                  style={{ transition: "stroke-dasharray 0.7s ease" }}
                />
              ))
            )}
          </svg>

          {/* Centre label (rotated back upright) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className={`font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-1 ${isLight ? "pixel-text-shadow" : ""}`}>
              {t("dashboard.total", "Total")}
            </p>
            <p className="font-pixel text-[20px] text-foreground pixel-text-shadow leading-none">
              {total}
            </p>
            <p className={`font-pixel text-[16px] text-muted-foreground mt-1 uppercase ${isLight ? "pixel-text-shadow" : ""}`}>
              {t("dashboard.tasks", "Tasks")}
            </p>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {segments.map((seg) => {
            const pct = total > 0 ? ((seg.count / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={seg.label} className="flex items-center gap-3">
                {/* Color square */}
                <div
                  className={`w-4 h-4 flex-shrink-0 ${seg.squareColor}`}
                  style={isLight ? { boxShadow: "1px 2px 0px rgba(45,18,5,0.30)" } : undefined}
                />

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`font-pixel text-[14px] uppercase tracking-wider ${seg.color} ${isLight ? "pixel-text-shadow" : ""}`}>
                    {seg.label}
                  </p>
                </div>

                {/* Count */}
                <p className={`font-pixel text-[14px] ${seg.color} flex-shrink-0 w-6 text-right ${isLight ? "pixel-text-shadow" : ""}`}>
                  {seg.count}
                </p>

                {/* Percent */}
                <p className={`font-pixel text-[14px] text-muted-foreground flex-shrink-0 w-14 text-right ${isLight ? "pixel-text-shadow" : ""}`}>
                  {pct}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusBreakdown;