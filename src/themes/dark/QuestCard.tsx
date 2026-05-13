import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quest } from "@/features/quests/types";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { useGetBids } from "@/features/quests/services/quest.service";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
}

const statusConfig: Record<string, { color: string; icon: string; animate?: boolean }> = {
  open: { color: "#4ade80", icon: "[!]", animate: true },
  bidding: { color: "#e3b86a", icon: "[✉]", animate: true },
  "in-progress": { color: "#e3b86a", icon: "[⚒]" },
  review: { color: "#a78bfa", icon: "[?]" },
  completed: { color: "#6a6a6a", icon: "[x]" },
};

const getStatusKey = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "review") return "in_review";
  if (s === "in-progress") return "in_progress";
  return s;
};

const theme = {
  bg: "#1a1a1b",
  border: "#4a3e2a",
  accent: "#e3b86a",
  muted: "#8a8a8a",
  paper: "#22201e",
  statsBg: "#1a1714",
  statsBorder: "#2a241e",
  skillsBg: "#2a241e",
  skillsBorder: "#4a3e2a",
  skillsText: "#e3b86a",
  divider: "#332d26",
  issuer: "#5a5a5a",
  pin: "#71717a",
  pinBorder: "#18181b",
};

const styleTag = `
  .dk-qcard {
    background-color: ${theme.bg};
    border: 3px solid ${theme.border};
    position: relative;
    image-rendering: pixelated;
  }
  .dk-qcard-inner {
    background-color: ${theme.paper};
    border: 1px solid ${theme.divider};
  }
  .dk-qcard .pin {
    width: 6px; height: 6px;
    background-color: ${theme.pin};
    border: 1px solid ${theme.pinBorder};
    position: absolute; top: 4px; left: 50%;
    transform: translateX(-50%);
    border-radius: 1px;
  }
  .dk-qcard .gold-text {
    color: ${theme.accent};
    text-shadow: 1px 1px 0px #000;
  }
`;

const QuestCardDark = ({ quest }: QuestCardProps) => {
  const { t, i18n } = useTranslation();
  const { data: bids = [] } = useGetBids(quest.id);
  const fontClass = "text-[20px]";
  const status = statusConfig[quest.status] || { color: "#ffffff", icon: "[ ]" };
  const statusColor = status.color;

  const formatEstimatedTime = (timeStr: string) => {
    if (!timeStr) return "";
    if (i18n.language !== "th") return timeStr;
    let formatted = timeStr;
    formatted = formatted.replace(/Days|Day/gi, "วัน");
    formatted = formatted.replace(/Weeks|Week/gi, "สัปดาห์");
    formatted = formatted.replace(/Months|Month/gi, "เดือน");
    formatted = formatted.replace(/Hours|Hour/gi, "ชั่วโมง");
    return formatted;
  };

  const cardVariants = {
    rest: { y: 0, scale: 1, boxShadow: "0px 4px 10px rgba(0,0,0,0.5)" },
    hover: {
      y: -6, scale: 1.01,
      boxShadow: `0px 10px 20px rgba(0,0,0,0.6), 0px 0px 15px ${theme.accent}40`,
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
        className="dk-qcard cursor-pointer h-full flex flex-col"
      >
        <Link to={`/quest/${quest.id}`} className="flex flex-col h-full p-1 block">
          <div className="pin"></div>
          <div className={`dk-qcard-inner h-full p-4 pt-5 flex flex-col gap-3 ${fontClass}`}>

            <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${theme.divider}` }}>
              <span className={cn("uppercase tracking-widest", i18n.language === "th" ? "text-[16px]" : "text-[16px]")} style={{ color: theme.muted }}>
                [{quest.category}]
              </span>
              <motion.span
                className={cn("uppercase flex items-center gap-1", i18n.language === "th" ? "text-[18px]" : "text-[18px]")}
                style={{ color: statusColor, textShadow: "1px 1px 0px #000" }}
                animate={status.animate ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {status.icon} {t(`questDetail.status.${getStatusKey(quest.status)}`)}
              </motion.span>
            </div>

            <h3 className={`leading-tight flex items-start gap-2 relative ${fontClass}`}>
              <motion.span variants={cursorVariants} className={`text-accent absolute -left-4 ${fontClass}`}>►</motion.span>
              <span className={`gold-text break-words overflow-hidden ${fontClass}`}>{quest.title}</span>
            </h3>

            <p className={`leading-relaxed line-clamp-2 flex-1 mt-1 ${fontClass}`} style={{ color: theme.muted }}>
              {quest.description}
            </p>

            {quest.skills && (
              <div className="flex flex-wrap gap-1 mt-2">
                {quest.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className={cn("pixel-font px-2 py-0.5 uppercase", i18n.language === "th" ? "text-[12px]" : "text-[12px]")}
                    style={{ backgroundColor: theme.skillsBg, border: `1px solid ${theme.skillsBorder}`, color: theme.skillsText }}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2 p-2 flex flex-col gap-2" style={{ backgroundColor: theme.statsBg, border: `1px solid ${theme.statsBorder}` }}>
              <div className="flex items-center justify-between">
                <motion.span className={`pixel-font gold-text flex items-center gap-2 ${fontClass}`} whileHover={{ scale: 1.05 }}>
                  <span className={`text-[#f1c40f] ${fontClass}`}>●</span> {quest.rewardPoints} {t("questCard.GP")}
                </motion.span>
                <div className={`pixel-text ${fontClass}`}>
                  <DifficultyStars level={quest.difficulty} />
                </div>
              </div>
              <div className={cn("flex items-center justify-between pixel-font", i18n.language === "th" ? "text-[14px]" : "text-[14px]")} style={{ color: theme.muted }}>
                <span>⌛ {formatEstimatedTime(quest.estimatedTime)}</span>
                <span>⚔ {bids.length} {t("questCard.totalBids")}</span>
              </div>
            </div>

            <div className={cn("pixel-font uppercase text-right mt-1", i18n.language === "th" ? "text-[13px]" : "text-[13px]")} style={{ color: theme.issuer }}>
              {t("questCard.issuedBy")} <span style={{ color: theme.muted }}>{quest.providerName}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default QuestCardDark;
