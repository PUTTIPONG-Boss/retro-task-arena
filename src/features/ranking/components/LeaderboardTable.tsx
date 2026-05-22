import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "../types";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/store/themeStore";

interface Props {
    entries: LeaderboardEntry[]; // Rank 4+ only
}

// ─── Sub-component: TableRow ──────────────────────────────────────────────────
interface TableRowProps {
    entry: LeaderboardEntry;
    index: number;
}

const TableRow = ({ entry, index }: TableRowProps) => {
    const { theme } = useThemeStore();
    const isLight = theme === "light";
    const displayName = entry.nameEn || entry.nameTh || entry.username;
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <motion.div
            className={cn(
                "grid grid-cols-[56px_1fr_120px_120px_100px] items-center px-5 py-3",
                "border-b border-border relative overflow-hidden",
                "hover:bg-white/5 transition-none group"
            )}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
        >
            {/* Left border highlight on hover */}
            <span
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-[3px] transition-none",
                    "bg-transparent group-hover:bg-accent/50"
                )}
            />

            {/* Col 1 — Rank */}
            <div className="flex items-center justify-center">
                <span className="font-pixel text-[18px]"
                    style={{ color: isLight ? "#5A3010" : undefined }}
                >{entry.rank}</span>
            </div>

            {/* Col 2 — Player info */}
            <div className="flex items-center gap-3">
                {/* Mini avatar */}
                <div
                    className="w-16 h-16 flex items-center justify-center border-2 text-sm flex-shrink-0"
                    style={{
                        borderColor: isLight ? "#8B5A20" : "hsl(var(--border))",
                        background: isLight ? "rgba(237,228,207,0.8)" : "transparent",
                    }}
                >
                    {entry.avatarUrl ? (
                        <img src={entry.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-pixel" style={{ color: isLight ? "#5A3010" : undefined }}>{avatarInitial}</span>
                    )}
                </div>

                {/* Name + level */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-pixel text-[14px] text-foreground uppercase tracking-wide"
                            style={isLight ? { color: "#2A1A08" } : undefined}>
                            {displayName}
                        </span>
                    </div>
                    <span className="text-[12px] text-muted-foreground truncate"
                        style={isLight ? { color: "#6B4C2A" } : undefined}>
                        {entry.username}
                    </span>
                    <div className="flex items-center gap-2">
                        <span
                            className="font-pixel text-[12px] border px-1 py-0.5"
                            style={isLight
                                ? { color: "#7A5C00", borderColor: "#8B5A20", background: "#EDE4CF" }
                                : { color: "hsl(var(--accent))", borderColor: "hsl(var(--border))", background: "rgba(255,255,255,0.05)" }
                            }
                        >
                            LV {entry.level}
                        </span>
                    </div>
                </div>
            </div>

            {/* Col 3 — EXP */}
            <div className="text-center">
                <span className="font-pixel text-[12px]" style={{ color: isLight ? "#3D1C08" : undefined }}>
                    {entry.totalExp.toLocaleString()}
                </span>
            </div>

            {/* Col 4 — Points */}
            <div className="text-center">
                <span className="font-pixel text-[12px]" style={{ color: isLight ? "#7A5C00" : "#eab308" }}>
                    {(entry.totalPointsEarned || 0).toLocaleString()}
                </span>
            </div>

            {/* Col 5 — Quests completed */}
            <div className="text-center">
                <span className="font-pixel text-[12px]" style={{ color: isLight ? "#3D1C08" : undefined }}>{entry.questsCompleted}</span>
            </div>
        </motion.div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
const LeaderboardTable = ({ entries }: Props) => {
    const { t } = useTranslation();
    
    const headers = [
        t("ranking.table.rank"),
        t("ranking.table.adventurer"),
        t("ranking.table.exp"),
        t("ranking.table.points"),
        t("ranking.table.quests")
    ];

    return (
        <div>
            <div className="bg-card pixel-border overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-[56px_1fr_120px_120px_100px] px-5 py-3 bg-muted border-b border-border items-center">
                    {headers.map((col, idx) => (
                        <span
                            key={idx}
                            className={cn(
                                "font-pixel text-[12px] text-muted-foreground uppercase tracking-widest",
                                idx !== 1 && "text-center" // จัดกลางทุกคอลัมน์ ยกเว้นคอลัมน์ชื่อผู้เล่น (idx 1)
                            )}
                        >
                            {col}
                        </span>
                    ))}
                </div>

                {/* Data rows */}
                {entries.map((entry, i) => (
                    <TableRow key={entry.userId} entry={entry} index={i} />
                ))}
            </div>
        </div>
    );
};

export default LeaderboardTable;