import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quest } from "../types";
import DifficultyStars from "./DifficultyStars";
import { useGetBids } from "../services/quest.service";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  quest: Quest;
}

// ปรับแต่งสีและไอคอนสไตล์ Retro
const statusConfig: Record<string, { color: string; icon: string; animate?: boolean }> = {
  open: { color: "#4ade80", icon: "[!]", animate: true }, // สีเขียวเรืองแสง
  bidding: { color: "#e3b86a", icon: "[✉]", animate: true }, // สีทอง
  "in-progress": { color: "#e3b86a", icon: "[⚒]" },
  review: { color: "#a78bfa", icon: "[?]" }, // สีม่วง
  completed: { color: "#6a6a6a", icon: "[x]" }, // สีเทา
};

const getStatusKey = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "review") return "in_review";
  if (s === "in-progress") return "in_progress";
  return s;
};

const QuestCard = ({ quest }: QuestCardProps) => {
  const { t, i18n } = useTranslation();
  const { data: bids = [] } = useGetBids(quest.id);
  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[18px]";
  const status = statusConfig[quest.status] || { color: "#ffffff", icon: "[ ]" };

  // ชุดสีสำหรับ Card (เข้ากับ Banner)
  const theme = {
    bg: "#1a1a1b", // พื้นหลังกระดาษ/ไม้สีเข้ม
    border: "#4a3e2a", // ขอบพิกเซล
    accent: "#e3b86a", // สีทองเน้น
    muted: "#8a8a8a", // ตัวหนังสือรอง
    paper: "#22201e", // สีพื้นหลังย่อยด้านใน
  };

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

  const styleTag = `
    .retro-card {
      background-color: ${theme.bg};
      border: 3px solid ${theme.border};
      position: relative;
      image-rendering: pixelated;
    }
    
    .retro-card-inner {
      background-color: ${theme.paper};
      border: 1px solid #332d26;
    }

    /* หมุดปักกระดาษมุมบน */
    .pin {
      width: 6px;
      height: 6px;
      background-color: #71717a;
      border: 1px solid #18181b;
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 1px;
    }

    .pixel-text {
      font-family: 'VT323', monospace, sans-serif;
    }

    .gold-text {
      color: ${theme.accent};
      text-shadow: 1px 1px 0px #000;
    }
  `;

  // Variants สำหรับ Framer Motion
  const cardVariants = {
    rest: { y: 0, scale: 1, boxShadow: "0px 4px 10px rgba(0,0,0,0.5)" },
    hover: {
      y: -6,
      scale: 1.01,
      boxShadow: `0px 10px 20px rgba(0,0,0,0.6), 0px 0px 15px ${theme.accent}40`,
      borderColor: theme.accent,
      transition: { type: "spring" as const, stiffness: 400, damping: 20 }
    }
  };

  const cursorVariants = {
    rest: { opacity: 0, x: -10 },
    hover: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      <style>{styleTag}</style>
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={cardVariants}
        className="retro-card cursor-pointer h-full flex flex-col"
      >
        <Link to={`/quest/${quest.id}`} className="flex flex-col h-full p-1 block">
          {/* หมุดปักกระดาษ (ตกแต่ง) */}
          <div className="pin"></div>

          <div className={`retro-card-inner h-full p-4 pt-5 flex flex-col gap-3 ${fontClass}`}>
            {/* Header: หมวดหมู่ และ สถานะ */}
            <div className="flex items-center justify-between border-b border-[#332d26] pb-2">
              <span className={cn(
                "uppercase tracking-widest flex items-center gap-1",
                i18n.language === "th" ? "text-[14px]" : "text-[14px]"
              )} style={{ color: theme.muted }}>
                <span>[{quest.category}]</span>
                {quest.workType && (
                  <span style={{ color: theme.accent }}>
                    [{t(`createQuest.workTypes.${quest.workType.toUpperCase()}`)}]
                  </span>
                )}
              </span>

              <motion.span
                className={cn(
                  "uppercase flex items-center gap-1",
                  i18n.language === "th" ? "text-[14px]" : "text-[14px]"
                )}
                style={{ color: status.color, textShadow: "1px 1px 0px #000" }}
                animate={status.animate ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {status.icon} {t(`questDetail.status.${getStatusKey(quest.status)}`)}
              </motion.span>
            </div>

            {/* Title: ชื่อเควส พร้อมลูกศรชี้เมื่อ Hover */}
            <h3 className={`leading-tight flex items-start gap-2 relative ${fontClass}`}>
              <motion.span variants={cursorVariants} className={`text-accent absolute -left-4 ${fontClass}`}>
                ►
              </motion.span>
              <span className={`gold-text break-words overflow-hidden ${fontClass}`}>
                {quest.title}
              </span>
            </h3>

            {/* Description: คำอธิบาย (ใช้ฟอนต์ปกติหรือฟอนต์ที่อ่านง่ายขึ้นเล็กน้อยเพื่อ UX ที่ดี) */}
            <p className={`leading-relaxed line-clamp-2 flex-1 mt-1 ${fontClass}`} style={{ color: theme.muted }}>
              {quest.description}
            </p>

            {/* Required Skills */}
            {quest.skills && (
              <div className="flex flex-wrap gap-1 mt-2">
                {quest.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className={cn(
                      "pixel-font bg-[#2a241e] border border-[#4a3e2a] px-2 py-0.5 text-[#e3b86a] uppercase",
                      i18n.language === "th" ? "text-[12px]" : "text-[12px]"
                    )}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Stats: รางวัลและความยาก */}
            <div className="mt-2 bg-[#1a1714] p-2 border border-[#2a241e] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <motion.span
                  className={`pixel-font gold-text flex items-center gap-2 ${fontClass}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={`text-[#f1c40f] ${fontClass}`}>●</span> {quest.rewardPoints} {t("questCard.GP")}
                </motion.span>
                <div className={`pixel-text ${fontClass}`}>
                  <DifficultyStars level={quest.difficulty} />
                </div>
              </div>

              <div className={cn(
                "flex items-center justify-between pixel-font",
                i18n.language === "th" ? "text-[12px]" : "text-[12px]"
              )} style={{ color: theme.muted }}>
                <span>⌛ {formatEstimatedTime(quest.estimatedTime)}</span>
                <span>⚔ {bids.length} {t("questCard.totalBids")}</span>
              </div>
            </div>

            {/* Footer: ผู้จ้างวาน */}
            <div className={cn(
              "pixel-font uppercase text-right mt-1",
              i18n.language === "th" ? "text-[11px]" : "text-[11px]"
            )} style={{ color: "#5a5a5a" }}>
              {t("questCard.issuedBy")} <span style={{ color: theme.muted }}>{quest.providerName}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default QuestCard;