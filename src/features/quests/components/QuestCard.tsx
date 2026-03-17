// import { Quest } from "@/data/mockData";
// import { Link } from "react-router-dom";
// import DifficultyStars from "./DifficultyStars";
// import { motion } from "framer-motion";

// interface QuestCardProps {
//   quest: Quest;
// }

// const statusColors: Record<string, string> = {
//   open: "text-success",
//   bidding: "text-accent",
//   "in-progress": "text-accent",
//   review: "text-accent",
//   completed: "text-muted-foreground",
// };

// const statusIcons: Record<string, string> = {
//   open: "🟢",
//   bidding: "📨",
//   "in-progress": "⚒",
//   review: "🔍",
//   completed: "✅",
// };

// const QuestCard = ({ quest }: QuestCardProps) => {
//   return (
//     <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
//       <Link to={`/quest/${quest.id}`}>
//         <div className="bg-card pixel-border p-5 hover:gold-glow cursor-pointer h-full flex flex-col gap-3 transition-shadow duration-200 hover:shadow-[0_0_12px_2px_hsl(var(--gold)/0.25)]">
//           {/* Header row */}
//           <div className="flex items-center justify-between">
//             <span className="font-pixel text-[8px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
//               📂 {quest.category}
//             </span>
//             <span className={`font-pixel text-[8px] uppercase flex items-center gap-1 ${statusColors[quest.status] || "text-foreground"}`}>
//               {statusIcons[quest.status] || "●"} {quest.status}
//             </span>
//           </div>

//           {/* Title */}
//           <h3 className="font-pixel text-[11px] leading-relaxed text-foreground pixel-text-shadow flex items-start gap-2">
//             <span className="text-base mt-0.5">📜</span>
//             <span>{quest.title}</span>
//           </h3>

//           {/* Description */}
//           <p className="text-lg leading-snug text-muted-foreground line-clamp-2 flex-1">
//             {quest.description}
//           </p>

//           {/* Stats */}
//           <div className="border-t-2 border-border pt-3 flex flex-col gap-2">
//             <div className="flex items-center justify-between">
//               <span className="font-pixel text-[9px] text-accent pixel-text-shadow flex items-center gap-1">
//                 🪙 {quest.rewardPoints} GP
//               </span>
//               <DifficultyStars level={quest.difficulty} />
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-base text-muted-foreground flex items-center gap-1">
//                 ⏳ {quest.estimatedTime}
//               </span>
//               <span className="text-base text-muted-foreground flex items-center gap-1">
//                 📋 {quest.bids.length} bid{quest.bids.length !== 1 ? "s" : ""}
//               </span>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-sm text-muted-foreground font-pixel text-[7px] flex items-center gap-1">
//             👤 {quest.providerName}
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// };

// export default QuestCard;


import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Quest } from "@/data/mockData";
import DifficultyStars from "./DifficultyStars";

interface QuestCardProps {
  quest: Quest;
}

// ปรับแต่งสีและไอคอนสไตล์ Retro
const statusConfig: Record<string, { color: string; icon: string; animate?: boolean }> = {
  open: { color: "#4ade80", icon: "![!]", animate: true }, // สีเขียวเรืองแสง
  bidding: { color: "#e3b86a", icon: "[✉]", animate: true }, // สีทอง
  "in-progress": { color: "#e3b86a", icon: "[⚒]" },
  review: { color: "#a78bfa", icon: "[?]" }, // สีม่วง
  completed: { color: "#6a6a6a", icon: "[x]" }, // สีเทา
};

const QuestCard = ({ quest }: QuestCardProps) => {
  const status = statusConfig[quest.status] || { color: "#ffffff", icon: "[ ]" };

  // ชุดสีสำหรับ Card (เข้ากับ Banner)
  const theme = {
    bg: "#1a1a1b", // พื้นหลังกระดาษ/ไม้สีเข้ม
    border: "#4a3e2a", // ขอบพิกเซล
    accent: "#e3b86a", // สีทองเน้น
    muted: "#8a8a8a", // ตัวหนังสือรอง
    paper: "#22201e", // สีพื้นหลังย่อยด้านใน
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
      transition: { type: "spring", stiffness: 400, damping: 20 }
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

          <div className="retro-card-inner h-full p-4 pt-5 flex flex-col gap-3">
            {/* Header: หมวดหมู่ และ สถานะ */}
            <div className="flex items-center justify-between border-b border-[#332d26] pb-2">
              <span className="pixel-text text-sm uppercase tracking-widest" style={{ color: theme.muted }}>
                [{quest.category}]
              </span>

              <motion.span
                className="pixel-text text-sm uppercase flex items-center gap-1"
                style={{ color: status.color, textShadow: "1px 1px 0px #000" }}
                animate={status.animate ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {status.icon} {quest.status}
              </motion.span>
            </div>

            {/* Title: ชื่อเควส พร้อมลูกศรชี้เมื่อ Hover */}
            <h3 className="pixel-text text-xl leading-tight flex items-start gap-2 relative" style={
              {
                fontSize: "20px",
              }
            }>
              <motion.span variants={cursorVariants} className="text-accent absolute -left-4">
                ►
              </motion.span>
              <span className="gold-text">
                {quest.title}
              </span>
            </h3>

            {/* Description: คำอธิบาย (ใช้ฟอนต์ปกติหรือฟอนต์ที่อ่านง่ายขึ้นเล็กน้อยเพื่อ UX ที่ดี) */}
            <p className="text-sm leading-relaxed line-clamp-2 flex-1 mt-1" style={{
              color: theme.muted,
              fontSize: "16px",

            }}>
              {quest.description}
            </p>

            {/* Stats: รางวัลและความยาก */}
            <div className="mt-2 bg-[#1a1714] p-2 border border-[#2a241e] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <motion.span
                  className="pixel-text text-lg gold-text flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-[#f1c40f]">●</span> {quest.rewardPoints} GP
                </motion.span>
                <div className="pixel-text text-lg">
                  <DifficultyStars level={quest.difficulty} />
                </div>
              </div>

              <div className="flex items-center justify-between pixel-text text-sm" style={{ color: theme.muted }}>
                <span>⌛ {quest.estimatedTime}</span>
                <span>⚔ {quest.bids.length} Adventurer(s)</span>
              </div>
            </div>

            {/* Footer: ผู้จ้างวาน */}
            <div className="pixel-text text-xs uppercase text-right mt-1" style={{
              color: "#5a5a5a",
              fontSize: "17px",
            }}>
              Issued by: <span style={{ color: theme.muted }}>{quest.providerName}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default QuestCard;