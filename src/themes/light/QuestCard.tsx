import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quest } from "@/features/quests/types";
import { useGetBids } from "@/features/quests/services/quest.service";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
}

const statusConfig: Record<string, { icon: string; animate?: boolean }> = {
  open: { icon: "[!]", animate: true },
  bidding: { icon: "[✉]", animate: true },
  "in-progress": { icon: "[⚒]" },
  review: { icon: "[?]" },
  completed: { icon: "[x]" },
};

const statusColors: Record<string, string> = {
  open: "#2A6E35",
  bidding: "#8B5E10",
  "in-progress": "#8B5E10",
  review: "#5B3A8B",
  completed: "#6A6A5A",
};

const SKILL_PALETTE = [
  { bg: "#A8C8E8", border: "#4A7AAA", color: "#0A2240" }, // blue
  { bg: "#C8A8E8", border: "#7A50AA", color: "#200840" }, // purple
  { bg: "#A8D8A8", border: "#4A8A4A", color: "#082008" }, // green
  { bg: "#E8C8A8", border: "#AA7A4A", color: "#402008" }, // orange
  { bg: "#A8E0D8", border: "#3A8880", color: "#082820" }, // teal
  { bg: "#E8A8B8", border: "#AA4A60", color: "#400818" }, // rose
  { bg: "#D8E8A8", border: "#809A3A", color: "#202800" }, // lime
  { bg: "#E8D8A8", border: "#AA9040", color: "#302000" }, // amber
];

function getSkillColor(skill: string) {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SKILL_PALETTE[Math.abs(hash) % SKILL_PALETTE.length];
}

const getStatusKey = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "review") return "in_review";
  if (s === "in-progress") return "in_progress";
  return s;
};

const theme = {
  bg: "#3D1C08",
  border: "#6B3810",
  accent: "#B87820",
  muted: "#5C3820",
  paper: "#E8CFA0",
  statsBg: "#D4B070",
  statsBorder: "#B8903A",
  skillsBg: "#C89A50",
  skillsBorder: "#8B5A20",
  skillsText: "#3D1C08",
  divider: "#C0923A",
  issuer: "#8B5A30",
  pin: "#D4A020",
  pinBorder: "#8B5A10",
};

const styleTag = `
  .lt-qcard {
    background-color: ${theme.bg};
    border: 3px solid ${theme.border};
    position: relative;
    image-rendering: pixelated;
    box-shadow: 2px 4px 0px #1A0A04, 4px 6px 0px #0A0402;
  }
  .lt-qcard-inner {
    background-color: ${theme.paper};
    border: 1px solid ${theme.divider};
  }
  .lt-qcard .pin {
    width: 6px; height: 6px;
    background-color: ${theme.pin};
    border: 1px solid ${theme.pinBorder};
    position: absolute; top: 4px; left: 50%;
    transform: translateX(-50%);
    border-radius: 1px;
  }
  .lt-qcard .gold-text {
    color: ${theme.accent};
    text-shadow: 1px 1px 0px rgba(0,0,0,0.3);
  }
`;

const QuestCardLight = ({ quest }: QuestCardProps) => {
  const { t, i18n } = useTranslation();
  const { data: bids = [] } = useGetBids(quest.id);
  const fontClass = "text-[20px]";
  const status = statusConfig[quest.status] || { icon: "[ ]" };
  const statusColor = statusColors[quest.status] || "#5C3820";

  const formatEstimatedTime = (timeStr: string) => {
    if (!timeStr) return "";
    if (i18n.language !== "th") return timeStr;
    return timeStr
      .replace(/Days|Day/gi, "วัน")
      .replace(/Weeks|Week/gi, "สัปดาห์")
      .replace(/Months|Month/gi, "เดือน")
      .replace(/Hours|Hour/gi, "ชั่วโมง");
  };

  const cardVariants = {
    rest: { y: 0, scale: 1, boxShadow: "2px 4px 0px #1A0A04, 4px 6px 0px #0A0402" },
    hover: {
      y: -6, scale: 1.01,
      boxShadow: `0px 10px 20px rgba(0,0,0,0.4), 0px 0px 15px ${theme.pin}40`,
      borderColor: theme.accent,
      transition: { type: "spring" as const, stiffness: 400, damping: 20 },
    },
  };

  const cursorVariants = {
    rest: { opacity: 0, x: -10 },
    hover: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  return (
    <>
      <style>{styleTag}</style>
      <motion.div
        initial="rest" whileHover="hover" animate="rest"
        variants={cardVariants}
        className="lt-qcard cursor-pointer h-full flex flex-col"
      >
        <Link to={`/quest/${quest.id}`} className="flex flex-col h-full p-1 block">
          <div className="pin" />
          <div className={`lt-qcard-inner h-full p-4 pt-5 flex flex-col gap-3 ${fontClass}`}>

            {/* Header */}
            <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${theme.divider}` }}>
              <span
                className={cn("uppercase tracking-widest flex items-center gap-1", i18n.language === "th" ? "text-[16px]" : "text-[16px]")}
                style={{ color: theme.muted }}
              >
                [{quest.category}]
                {quest.workType && (
                  <span style={{ color: theme.accent }}>[{t(`createQuest.workTypes.${quest.workType.toUpperCase()}`)}]</span>
                )}
              </span>
              <motion.span
                className={cn("uppercase flex items-center gap-1", i18n.language === "th" ? "text-[18px]" : "text-[18px]")}
                style={{ color: statusColor, textShadow: "1px 1px 0px rgba(0,0,0,0.2)" }}
                animate={status.animate ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {status.icon} {t(`questDetail.status.${getStatusKey(quest.status)}`)}
              </motion.span>
            </div>

            {/* Title */}
            <h3 className={`leading-tight flex items-start gap-2 relative ${fontClass}`}>
              <motion.span variants={cursorVariants} className={`absolute -left-4 ${fontClass}`} style={{ color: theme.accent }}>►</motion.span>
              <span className={`gold-text break-words overflow-hidden ${fontClass}`}>{quest.title}</span>
            </h3>

            {/* Description */}
            <p className={`leading-relaxed line-clamp-2 flex-1 mt-1 ${fontClass}`} style={{ color: theme.muted }}>
              {quest.description}
            </p>

            {/* Skills */}
            {quest.skills && (
              <div className="flex flex-wrap gap-1 mt-2">
                {quest.skills.split(',').map((skill, index) => {
                  const sc = getSkillColor(skill.trim());
                  return (
                    <span
                      key={index}
                      className={cn("pixel-font px-2 py-0.5 uppercase", i18n.language === "th" ? "text-[12px]" : "text-[12px]")}
                      style={{ backgroundColor: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
                    >
                      {skill.trim()}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            <div className="mt-2 p-2 flex flex-col gap-2" style={{ backgroundColor: theme.statsBg, border: `1px solid ${theme.statsBorder}` }}>
              <div className="flex items-center justify-between">
                <motion.span className={`pixel-font flex items-center gap-2 ${fontClass}`} whileHover={{ scale: 1.05 }} style={{ color: theme.muted }}>
                  <span style={{ color: "#FFD700" }}>●</span> {quest.rewardPoints} {t("questCard.GP")}
                </motion.span>
                <div className="flex items-center gap-0.5 text-[10px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < quest.difficulty ? "#6B3010" : "#C0923A", opacity: i < quest.difficulty ? 1 : 0.35 }}>⚔</span>
                  ))}
                </div>
              </div>
              <div
                className={cn("flex items-center justify-between pixel-font", i18n.language === "th" ? "text-[14px]" : "text-[14px]")}
                style={{ color: theme.muted }}
              >
                <span>⌛ {formatEstimatedTime(quest.estimatedTime)}</span>
                <span>⚔ {bids.length} {t("questCard.totalBids")}</span>
              </div>
            </div>

            {/* Footer */}
            <div
              className={cn("pixel-font uppercase text-right mt-1", i18n.language === "th" ? "text-[13px]" : "text-[13px]")}
              style={{ color: theme.issuer }}
            >
              {t("questCard.issuedBy")} <span style={{ color: theme.muted }}>{quest.providerName}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default QuestCardLight;
