import { LeaderboardEntry } from "../types";
import { Sword } from "lucide-react";
import PixelBuilding from "@/components/icons/PixelBuilding";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelCoin from "@/components/icons/PixelCoin";
import { useGetLeaderboard } from "../services/ranking.service";

interface Props {
    entries: LeaderboardEntry[];
}

interface StatCardProps {
    label: string;
    value: string;
    subLabel: string;
    icon: React.ReactNode;
}

// ─── Sub-component: StatCard ──────────────────────────────────────────────────
const StatCard = ({ label, value, subLabel, icon }: StatCardProps) => (
    <div className="bg-card pixel-border p-4 relative overflow-hidden group hover:bg-white/5 transition-colors">
        <p className="font-pixel text-[14px] text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="font-pixel text-[20px] text-accent leading-none mb-1">{value}</p>
        <p className="text-[14px] text-muted-foreground truncate">{subLabel}</p>

        {/* Icon watermark */}
        <div className="absolute right-3 bottom-2 opacity-15 pointer-events-none transition-transform group-hover:scale-110">
            {icon}
        </div>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const StatsStrip = ({ entries }: Props) => {
    // ดึงข้อมูล Leaderboard ของเควสต์โดยเฉพาะเพื่อหาคนเก่งสุด
    const { data: questEntries } = useGetLeaderboard("quests");
    // ดึงข้อมูล Leaderboard ของ EXP โดยเฉพาะเพื่อหาคนเก่งสุด
    const { data: expEntries } = useGetLeaderboard("points");

    const totalPlayers = entries.length;
    
    // หาผู้เล่นที่ทำเควสต์สูงสุด (Sort เผื่อไว้เพื่อให้แน่ใจว่าได้คนสูงสุดจริงๆ)
    const sortedQuestEntries = questEntries ? [...questEntries].sort((a, b) => b.questsCompleted - a.questsCompleted) : [];
    const topQuestPlayer = sortedQuestEntries[0];
    const topQuestName = topQuestPlayer ? (topQuestPlayer.nameEn || topQuestPlayer.nameTh || topQuestPlayer.username) : "—";
    const topQuestCount = topQuestPlayer ? topQuestPlayer.questsCompleted : 0;

    // หาผู้เล่นที่ได้ EXP สูงสุด (จาก API points โดยตรง)
    const sortedExpEntries = expEntries ? [...expEntries].sort((a, b) => b.totalExp - a.totalExp) : [];
    const topExpPlayer = sortedExpEntries[0];
    const topExpName = topExpPlayer ? (topExpPlayer.nameEn || topExpPlayer.nameTh || topExpPlayer.username) : "—";
    const topExpScore = topExpPlayer ? topExpPlayer.totalExp.toLocaleString() : "—";

    const totalExp = entries.reduce((sum, e) => sum + e.totalExp, 0);

    const stats: StatCardProps[] = [
        { label: "ผู้เล่นทั้งหมด", value: totalPlayers.toLocaleString(), subLabel: "นักผจญภัยที่ลงทะเบียน", icon: <PixelBuilding size={28} /> },
        { label: "เควสต์สำเร็จสูงสุด", value: `${topQuestCount}`, subLabel: `โดย ${topQuestName}`, icon: <Sword size={28} /> },
        { label: "EXP สูงสุด", value: topExpScore, subLabel: `โดย ${topExpName}`, icon: <PixelTrophy size={28} /> },
        { label: "EXP รวมทั้งหมด", value: totalExp.toLocaleString(), subLabel: "รวม EXP ทุกคน", icon: <PixelCoin size={28} /> },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </div>
    );
};

export default StatsStrip;