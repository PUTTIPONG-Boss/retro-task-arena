import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LeaderboardEntry } from "../types";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import PixelCoin from "@/components/icons/PixelCoin";
import { useRankingStore } from "../store/rankingStore";
import { useThemeStore } from "@/store/themeStore";

interface Props {
    entries: LeaderboardEntry[]; // Top 3 entries only
}

// ─── Medal config ─────────────────────────────────────────────────────────────
const MEDAL = {
    1: { color: "#FFD700", borderColor: "#FFD700", bgColor: "#ffd70015", lightBgColor: "rgba(255,215,0,0.18)", lightBorderColor: "#B8860B", lightColor: "#7A5C00", podiumHeight: "h-44", avatarSize: "w-24 h-24 text-4xl", labelNum: "①", rankLabel: "#1" },
    2: { color: "#C0C0C0", borderColor: "#aaaaaa", bgColor: "#c0c0c015", lightBgColor: "rgba(160,160,160,0.15)", lightBorderColor: "#7A7A7A", lightColor: "#4A4A4A", podiumHeight: "h-36", avatarSize: "w-20 h-20 text-3xl", labelNum: "②", rankLabel: "#2" },
    3: { color: "#CD7F32", borderColor: "#a0633a", bgColor: "#cd7f3215", lightBgColor: "rgba(160,90,30,0.15)", lightBorderColor: "#7A4A1A", lightColor: "#5A3010", podiumHeight: "h-28", avatarSize: "w-16 h-16 text-2xl", labelNum: "③", rankLabel: "#3" },
} as const;

// ─── Sub-component: PodiumCard ────────────────────────────────────────────────
interface PodiumCardProps {
    entry: LeaderboardEntry;
    order: number; // CSS order สำหรับ flexbox (rank1 อยู่กลาง)
}

const PodiumCard = ({ entry, order }: PodiumCardProps) => {
    const { t } = useTranslation();
    const { sortBy } = useRankingStore();
    const { theme } = useThemeStore();
    const isLight = theme === "light";
    const rank = entry.rank as 1 | 2 | 3;
    const medal = MEDAL[rank];
    const displayName = entry.nameEn || entry.nameTh || entry.username;
    const activeColor = isLight ? medal.lightColor : medal.color;
    const activeBorderColor = isLight ? medal.lightBorderColor : medal.borderColor;
    const activeBgColor = isLight ? medal.lightBgColor : medal.bgColor;

    // ตัวอักษรแรกของชื่อ สำหรับ avatar placeholder
    const avatarInitial = displayName.charAt(0).toUpperCase();

    // ดึงค่าสถิติหลักตาม sortBy
    const getPrimaryValue = () => {
        if (sortBy === "quests") return { value: entry.questsCompleted, label: t("ranking.table.quests") };
        if (sortBy === "points") return { value: entry.totalPointsEarned || 0, label: t("ranking.table.points") };
        return { value: entry.totalExp, label: t("ranking.table.exp") };
    };

    const primary = getPrimaryValue();

    return (
        <motion.div
            className="flex flex-col items-center gap-2"
            style={{ order }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.15, duration: 0.4 }}
        >
            {/* Avatar + Crown (เฉพาะ rank 1) */}
            <div className="relative flex flex-col items-center">
                {rank === 1 && (
                    <motion.span
                        className="absolute -top-8 text-3xl z-10"
                        animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ filter: `drop-shadow(0 0 8px #f1c40f)` }}
                    >
                        👑
                    </motion.span>
                )}

                {/* Avatar box */}
                <motion.div
                    className={`${medal.avatarSize} flex items-center justify-center font-bold border-2 relative`}
                    style={{
                        background: isLight ? `rgba(237,228,207,0.92)` : medal.bgColor,
                        borderColor: activeBorderColor,
                        boxShadow: rank === 1
                            ? `0 0 20px ${activeColor}88, 0 0 40px ${activeColor}44, 4px 4px 0 ${isLight ? "#00000033" : "#00000099"}`
                            : `4px 4px 0 ${isLight ? "#00000033" : "#00000099"}`,
                    }}
                    animate={rank === 1 ? { boxShadow: [`0 0 20px ${activeColor}88`, `0 0 30px ${activeColor}cc`, `0 0 20px ${activeColor}88`] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {entry.avatarUrl ? (
                        <img src={entry.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="leading-none" style={{ color: activeColor }}>{avatarInitial}</span>
                    )}

                    {/* Level badge */}
                    <span
                        className="absolute -bottom-2 -right-2 border font-pixel text-[10px] px-1.5 py-0.5 leading-none z-20 shadow-md whitespace-nowrap"
                        style={{
                            background: isLight ? "#EDE4CF" : "#1a1a1a",
                            borderColor: activeBorderColor,
                            color: activeColor,
                        }}
                    >
                        LV {entry.level}
                    </span>
                </motion.div>
            </div>

            {/* Podium block */}
            <div
                className={`${medal.podiumHeight} w-44 border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:brightness-110`}
                style={{
                    background: isLight ? `rgba(237,228,207,0.93)` : activeBgColor,
                    borderColor: activeBorderColor,
                    boxShadow: isLight
                        ? `inset 0 0 20px ${activeColor}22, 2px 2px 0 #00000022`
                        : `inset 0 0 20px ${activeColor}22`,
                }}
            >
                {/* Large Background Rank Watermark */}
                <span
                    className="font-pixel text-6xl absolute pointer-events-none select-none"
                    style={{ color: activeColor, opacity: isLight ? 0.08 : 0.10, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                >
                    {rank}
                </span>

                {/* Content inside Podium */}
                <div className="z-10 flex flex-col items-center gap-1.5 w-full px-2">
                    {/* Name & Surname */}
                    <div className="flex flex-col items-center">
                        <p className="font-pixel text-[14px] uppercase tracking-wide text-center leading-tight mb-0.5" style={{ color: activeColor }}>
                            {displayName.split(' ')[0]}
                        </p>
                        {displayName.split(' ').length > 1 && (
                            <p className="font-pixel text-[10px] uppercase tracking-wide text-center leading-tight opacity-80" style={{ color: activeColor }}>
                                {displayName.split(' ').slice(1).join(' ')}
                            </p>
                        )}
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-0.5 mt-0.5">
                        <p
                            className="font-pixel text-[14px] text-center"
                            style={{ color: activeColor, textShadow: `0 0 10px ${activeColor}44` }}
                        >
                            {primary.value.toLocaleString()}
                        </p>
                        <p className="font-pixel text-[8px] uppercase tracking-tighter opacity-70" style={{ color: activeColor }}>
                            {primary.label}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-center gap-4 mt-1 opacity-80">
                            <div className="flex items-center gap-1">
                                {sortBy === "exp" ? (
                                    <>
                                        <PixelClipboardList size={14} style={{ color: activeColor }} />
                                        <span className="font-pixel text-[12px]" style={{ color: activeColor }}>
                                            {entry.questsCompleted}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-pixel text-[10px]" style={{ color: activeColor }}>EXP</span>
                                        <span className="font-pixel text-[12px]" style={{ color: activeColor }}>
                                            {entry.totalExp.toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                {sortBy === "points" ? (
                                    <>
                                        <PixelClipboardList size={14} style={{ color: activeColor }} />
                                        <span className="font-pixel text-[12px]" style={{ color: activeColor }}>
                                            {entry.questsCompleted}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <PixelCoin size={14} style={{ color: activeColor }} />
                                        <span className="font-pixel text-[12px]" style={{ color: activeColor }}>
                                            {(entry.totalPointsEarned || 0).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small corner rank label */}
                <span className="font-pixel text-[18px] absolute top-2 right-2 opacity-40" style={{ color: activeColor }}>
                    #{rank}
                </span>
            </div>
        </motion.div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
const PodiumTop3 = ({ entries }: Props) => {
    const { t } = useTranslation();
    if (entries.length === 0) return null;

    // Flexbox order: rank2=1, rank1=2 (กลาง), rank3=3
    const orderMap: Record<number, number> = { 1: 2, 2: 1, 3: 3 };

    return (
        <div>
            <h2 className="font-pixel text-[20px] text-accent uppercase tracking-widest mb-12 flex items-center gap-3">
                🥇 {t("ranking.podium.title")}
                <span className="flex-1 h-0.5 bg-gradient-to-r from-accent to-transparent" />
            </h2>

            <div className="flex justify-center items-end gap-12 mb-10 px-2">
                {entries.map((entry) => (
                    <PodiumCard key={entry.userId} entry={entry} order={orderMap[entry.rank]} />
                ))}
            </div>
        </div>
    );
};

export default PodiumTop3;