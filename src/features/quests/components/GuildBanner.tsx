// import { motion } from "framer-motion";

// const GuildBanner = () => {
//   const particles = Array.from({ length: 12 }, (_, i) => ({
//     id: i,
//     left: `${8 + Math.random() * 84}%`,
//     delay: Math.random() * 4,
//     duration: 2 + Math.random() * 3,
//     size: Math.random() > 0.5 ? "text-[6px]" : "text-[4px]",
//   }));

//   return (
//     <div className="relative w-full overflow-hidden pixel-border bg-secondary">
//       {/* Pixel corner decorations */}
//       <div className="absolute top-2 left-3 font-pixel text-[8px] text-muted-foreground/30">┌─</div>
//       <div className="absolute top-2 right-3 font-pixel text-[8px] text-muted-foreground/30">─┐</div>
//       <div className="absolute bottom-2 left-3 font-pixel text-[8px] text-muted-foreground/30">└─</div>
//       <div className="absolute bottom-2 right-3 font-pixel text-[8px] text-muted-foreground/30">─┘</div>

//       {/* Floating particles */}
//       {particles.map((p) => (
//         <motion.span
//           key={p.id}
//           className={`absolute ${p.size} text-accent/40 pointer-events-none`}
//           style={{ left: p.left, bottom: "10%" }}
//           animate={{
//             y: [0, -60, -100],
//             opacity: [0, 0.6, 0],
//             scale: [0.5, 1, 0.3],
//           }}
//           transition={{
//             duration: p.duration,
//             delay: p.delay,
//             repeat: Infinity,
//             ease: "easeOut",
//           }}
//         >
//           ✦
//         </motion.span>
//       ))}

//       {/* Main content */}
//       <div className="relative flex flex-col items-center justify-center py-10 gap-2">
//         {/* Decorative top line */}
//         <div className="flex items-center gap-3 mb-1">
//           <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
//           <span className="text-lg text-muted-foreground/60">⚜</span>
//           <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
//         </div>

//         {/* Title row */}
//         <div className="flex items-center gap-4">
//           <span className="text-2xl">⚔</span>
//           <h1 className="font-pixel text-[18px] sm:text-[22px] text-accent pixel-text-shadow text-center leading-relaxed">
//             Quest Board
//           </h1>
//           <span className="text-2xl">🛡</span>
//         </div>

//         {/* Subtitle */}
//         <p className="font-pixel text-[8px] text-muted-foreground tracking-[0.3em] uppercase">
//           ── Inet Quest Board ──
//         </p>

//         {/* Blinking stars */}
//         <div className="flex gap-2 mt-2">
//           {[0, 1, 2, 3, 4].map((i) => (
//             <span
//               key={i}
//               className="animate-blink-star text-accent/70 text-sm"
//               style={{ animationDelay: `${i * 0.4}s` }}
//             >
//               ✦
//             </span>
//           ))}
//         </div>

//         {/* Bottom decorative line */}
//         <div className="flex items-center gap-3 mt-1">
//           <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
//           <span className="text-lg text-muted-foreground/60">⚜</span>
//           <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuildBanner;



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EnhancedGuildBanner = () => {
  // 1. กำหนดอนุภาคเป็นเหรียญทองพิกเซลที่จะลอยขึ้นและกะพริบ
  const particleCount = 15;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`, // หลีกเลี่ยงมุม
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: Math.random() > 0.5 ? 6 : 4,
    rotation: Math.random() * 360,
  }));

  // 2. กำหนดสีสำหรับธีมมืดสไตล์ย้อนยุค
  const colors = {
    bg: "#1a1a1a", // พื้นหลังมืด
    border: "#4a3e2a", // ขอบโลหะพิกเซล
    textAccent: "#e3b86a", // สีทองเน้น
    textMuted: "#6a6a6a", // สีเทาอ่อน
    shadow: "#00000033",
    glow: "#f1c40f",
  };

  // 3. CSS Styles สำหรับสไตล์พิกเซลและองค์ประกอบที่กำหนดเอง
  const styleTag = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    .retro-banner {
      font-family: 'VT323', monospace; /* ฟอนต์พิกเซลที่สมบูรณ์แบบ */
      background-color: ${colors.bg};
      border: 4px solid ${colors.border}; /* ขอบโลหะพิกเซลแบบยกสูง */
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 20px ${colors.shadow};
    }

    .pixel-corner {
      font-size: 10px;
      color: ${colors.textAccent}aa;
      position: absolute;
      opacity: 0.5;
    }

    .pixel-border-top, .pixel-border-bottom {
      height: 2px;
      background: ${colors.textAccent};
      width: 80%;
      position: absolute;
      left: 10%;
    }
    .pixel-border-top { top: 6px; }
    .pixel-border-bottom { bottom: 6px; }

    .title-glow {
      text-shadow: 0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}44;
    }

    .pixel-star {
      font-size: 16px;
      margin: 0 4px;
    }

    @keyframes scroll-text {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    .scrolling-text-container {
      overflow: hidden;
      width: 80%;
      margin: 0 auto;
      text-align: center;
    }

    // .scrolling-text {
    //   display: inline-block;
    //   white-space: nowrap;
    //   animation: scroll-text 15s linear infinite;
    // }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div className="retro-banner p-10 flex flex-col items-center justify-center gap-4">
        {/* 4. การตกแต่งพื้นหลังและขอบ */}
        <div className="pixel-border-top"></div>
        <div className="pixel-border-bottom"></div>
        <div className="pixel-corner top-2 left-3">┌─</div>
        <div className="pixel-corner top-2 right-3">─┐</div>
        <div className="pixel-corner bottom-2 left-3">└─</div>
        <div className="pixel-corner bottom-2 right-3">─┘</div>

        {/* 5. อนุภาคเหรียญทองพิกเซลลอยขึ้น */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="pixel-coin absolute text-accent"
            style={{
              left: p.left,
              bottom: "10%",
              fontSize: `${p.size}px`,
              color: colors.textAccent,
              pointerEvents: "none",
            }}
            animate={{
              y: [0, -100, -150], // ลอยขึ้น
              x: [0, Math.random() * 20 - 10, 0], // ส่ายเล็กน้อย
              opacity: [0, 0.8, 0],
              scale: [0.3, 1, 0.2],
              rotate: [0, p.rotation, p.rotation * 2], // หมุน
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            ●
          </motion.span>
        ))}

        {/* 6. เนื้อหาหลัก */}
        {/* เส้นตกแต่งด้านบน */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '12px', color: colors.textMuted }}>━━━</span>
          <span style={{ fontSize: '18px', color: colors.textMuted }}>⚜</span>
          <span style={{ fontSize: '12px', color: colors.textMuted }}>━━━</span>
        </div>

        {/* แถวชื่อเรื่องพร้อมเอฟเฟกต์แสงและสั่น */}
        <div className="flex items-center gap-6">
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}
          >
            ⚔
          </motion.span>
          <motion.h1
            className="text-4xl title-glow"
            style={{ color: colors.textAccent, lineHeight: '1.2' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Inet Quest Board
          </motion.h1>
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}
          >
            🛡
          </motion.span>
        </div>

        {/* ซับไทเทิลเลื่อน (Scrolling Marquee) */}
        <div className="scrolling-text-container">
          <span
            className="scrolling-text uppercase"
            style={{
              fontSize: '19px',
              color: colors.textMuted,
              letterSpacing: '0.3em',
            }}
          >
            Inet Quest Board ✦ New Quests Daily ✦ Accept Your Destiny ✦ Inet Quest Board
          </span>
        </div>

        {/* ดาวกะพริบและขยาย (Pulse) */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="pixel-star"
              style={{ color: colors.textAccent }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.span>
          ))}
        </div>

        {/* เส้นตกแต่งด้านล่าง */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '12px', color: colors.textMuted }}>━━━</span>
          <span style={{ fontSize: '18px', color: colors.textMuted }}>⚜</span>
          <span style={{ fontSize: '12px', color: colors.textMuted }}>━━━</span>
        </div>
      </div>
    </>
  );
};

export default EnhancedGuildBanner;