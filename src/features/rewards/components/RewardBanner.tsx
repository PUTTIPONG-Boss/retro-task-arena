import React, { useMemo } from "react";
import { motion } from "framer-motion";
// ⭐️ 1. นำเข้า useTranslation
import { useTranslation } from "react-i18next";

const RewardBanner = () => {
  // ⭐️ 2. เรียกใช้ useTranslation
  const { t, i18n } = useTranslation();

  // ⭐️ 3. สร้าง fontClass สำหรับจัดการฟอนต์ภาษาไทย
  const fontClass = i18n.language === "th" ? "font-['TA-ChaiLai'] pt-2" : "font-pixel";

  // 1. Define particles (gold coins and sparkles)
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: Math.random() > 0.6 ? 8 : 4,
      rotation: Math.random() * 360,
      type: Math.random() > 0.3 ? "coin" : "star",
    })), []
  );

  // 2. Define theme colors
  const colors = {
    bg: "#1a1a1b",
    border: "#4a3e2a",
    textAccent: "#e3b86a", // Gold
    textMuted: "#6a6a6a",
    glow: "#f1c40f",
    shadow: "#00000066",
  };

  // ⭐️ 4. ลบ @import และ @font-face ออกจาก styleTag เพราะเราย้ายไปไว้ที่ index.css แล้ว
  // (ถ้าคุณใส่ .retro-banner-shop ไว้ใน index.css แล้ว สามารถลบ styleTag ทิ้งทั้งหมดได้เลยครับ แต่อันนี้ผมคงไว้ให้เผื่อคุณยังไม่ได้ย้าย)
  const styleTag = `
    .retro-banner-shop {
      background-color: ${colors.bg};
      border: 4px solid ${colors.border};
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 25px ${colors.shadow};
    }

    .pixel-decoration {
      font-size: 10px;
      color: ${colors.textAccent}88;
      position: absolute;
      opacity: 0.6;
      pointer-events: none;
    }

    .shop-title-glow {
      text-shadow: 0 0 10px ${colors.glow}aa, 0 0 20px ${colors.glow}44;
    }

    .marquee-container {
      overflow: hidden;
      width: 100%;
      margin: 0 auto;
      white-space: nowrap;
    }

    @keyframes marquee-slide {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-100%, 0); }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      {/* ⭐️ 5. เพิ่ม ${fontClass} ไปที่ div หลัก */}
      <div className={`retro-banner-shop p-10 flex flex-col items-center justify-center gap-4 my-4 ${fontClass}`}>
        {/* Decorations */}
        <div className="pixel-decoration top-2 left-3">╔══</div>
        <div className="pixel-decoration top-2 right-3">══╗</div>
        <div className="pixel-decoration bottom-2 left-3">╚══</div>
        <div className="pixel-decoration bottom-2 right-3">══╝</div>

        {/* Floating Gold & Sparkles */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: p.left,
              bottom: "-10%",
              fontSize: `${p.size}px`,
              color: p.type === "coin" ? colors.textAccent : "#fff",
            }}
            animate={{
              y: [0, -200, -300],
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.2, 0.4],
              rotate: [0, p.rotation, p.rotation * 2],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            {p.type === "coin" ? "●" : "✦"}
          </motion.span>
        ))}

        {/* Top line decoration */}
        <div className="flex items-center gap-4 opacity-50">
          <span style={{ color: colors.textMuted }}>━━━━━</span>
          <span className="text-xl">💰</span>
          <span style={{ color: colors.textMuted }}>━━━━━</span>
        </div>

        {/* Main Title */}
        <div className="flex items-center gap-6">
          <motion.span
            className="text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🏪
          </motion.span>
          <motion.h1
             /* ⭐️ 6. ปรับขนาดฟอนต์ของ Title เมื่อเป็นภาษาไทยเพื่อความสวยงาม */
            className={`text-accent shop-title-glow ${i18n.language === 'th' ? 'text-5xl pt-2' : 'text-4xl'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* ⭐️ 7. ดึงคำแปล Title (ใช้อันเดียวกับหน้า Shop หลักได้) */}
            {t("rewardShop.title")}
          </motion.h1>
          <motion.span
            className="text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            💎
          </motion.span>
        </div>

        {/* Marquee Subtitle */}
        <div className="marquee-container opacity-60">
          <div 
             /* ⭐️ 8. เพิ่ม fontClass และปรับขนาดฟอนต์ซับไทเทิล */
            className={`marquee-text uppercase tracking-[0.2em] ${fontClass}`} 
            style={{
              color: colors.textMuted,
              textAlign: "center",
              fontSize: i18n.language === "th" ? "14px" : "10px",
            }}
          >
            {/* ⭐️ 9. ดึงคำแปล Marquee (ดึงจาก rewardBanner ใน JSON ใหม่) */}
            {t("rewardBanner.marquee", "✦ Legendary valuable items ✦ Rare merchandise ✦ Limited Edition Items ✦ Exclusive Rewards ✦")}
          </div>
        </div>

        {/* Description line */}
        <p 
          /* ⭐️ 10. เพิ่ม fontClass และปรับการตั้งค่า */
          className={`text-foreground/80 text-center max-w-md ${fontClass}`} 
          style={{
            fontSize: i18n.language === "th" ? "24px" : "20px",
          }}
        >
          {/* ⭐️ 11. ดึงคำแปล Description (ดึงจาก rewardBanner ใน JSON ใหม่) */}
          {t("rewardBanner.description", "Trade your hard-earned gold for items.")}
        </p>

        {/* Bottom line decoration */}
        <div className="flex gap-3 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-accent text-lg"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            >
              ★
            </motion.span>
          ))}
        </div>
      </div>
    </>
  );
};

export default RewardBanner;