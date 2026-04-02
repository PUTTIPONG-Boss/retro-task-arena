import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Gem } from "lucide-react";
import PixelStore from "@/components/icons/PixelStore";
import PixelGem from "@/components/icons/PixelGem";

const RewardBanner = () => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[24px]" : "text-[24px]";

  // Define particles (gold coins and sparkles)
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

  // Define theme colors
  const colors = {
    bg: "#1a1a1b",
    border: "#4a3e2a",
    textAccent: "#e3b86a", // Gold
    textMuted: "#6a6a6a",
    glow: "#f1c40f",
    shadow: "#00000066",
  };

  const styleTag = `
    .retro-banner-shop {
      font-family: 'TA_8bit', sans-serif !important;
      -webkit-font-smoothing: none;
      font-smooth: never;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 10px 25px ${colors.shadow};
    }

    .banner-content {
      position: relative;
      z-index: 10;
    }

    .banner-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      object-fit: cover;
    }

    /* --- สัดส่วนขนาดตัวอักษรเทียบกับ Base Size --- */
    .pixel-decoration { font-size: 0.4em; color: ${colors.textAccent}88; position: absolute; opacity: 0.6; pointer-events: none; z-index: 20; }
    
    .shop-title-glow { text-shadow: 0 0 10px ${colors.glow}aa, 0 0 20px ${colors.glow}44; }

    .marquee-container {
      overflow: hidden;
      width: 100%;
      margin: 0 auto;
      white-space: nowrap;
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div className={`retro-banner-shop p-10 flex flex-col items-center justify-center gap-4 my-4 ${fontClass}`}>
        {/* Custom SVG Background */}
        <svg 
          className="banner-svg"
          viewBox="0 0 1600 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="reward_baseBg" x1="800" y1="0" x2="800" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1A1A1A"/>
              <stop offset="1" stopColor="#0A0A0A"/>
            </linearGradient>

            <filter id="reward_pixel_glow" x="0" y="0">
              <feFlood x="4" y="4" height="2" width="2"/>
              <feComposite width="8" height="8"/>
              <feTile result="a"/>
              <feComposite in="SourceGraphic" in2="a" operator="in"/>
              <feMorphology operator="dilate" radius="2"/>
            </filter>

            <radialGradient id="reward_centerSpot" cx="0.5" cy="0.5" r="0.6">
              <stop stopColor="#F1C40F" stopOpacity="0.12"/>
              <stop offset="0.4" stopColor="#E3B86A" stopOpacity="0.05"/>
              <stop offset="0.8" stopColor="#1A1A1A" stopOpacity="0"/>
            </radialGradient>

            <pattern id="reward_dither" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="transparent"/>
              <rect x="0" y="0" width="4" height="4" fill="#000000" fillOpacity="0.3"/>
              <rect x="4" y="4" width="4" height="4" fill="#000000" fillOpacity="0.3"/>
              <rect x="0" y="4" width="2" height="2" fill="#4A3E2A" fillOpacity="0.1"/>
            </pattern>

            <pattern id="reward_pixelWall" width="128" height="64" patternUnits="userSpaceOnUse">
              <rect width="128" height="64" fill="#151515"/>
              <rect x="0" y="0" width="62" height="30" fill="#1C1C1C"/>
              <rect x="64" y="0" width="62" height="30" fill="#181818"/>
              <rect x="-32" y="32" width="62" height="30" fill="#1A1A1A"/>
              <rect x="32" y="32" width="62" height="30" fill="#1E1E1E"/>
              <rect x="96" y="32" width="62" height="30" fill="#171717"/>
              <path d="M0 0H62 M64 0H126 M-32 32H30 M32 32H94" stroke="#252525" strokeWidth="2"/>
              <path d="M0 30H62 M64 30H126 M-32 62H30 M32 62H94" stroke="#0F0F0F" strokeWidth="2"/>
            </pattern>
          </defs>

          <rect width="1600" height="900" fill="url(#reward_baseBg)"/>
          <rect width="1600" height="900" fill="url(#reward_pixelWall)"/>
          <rect width="1600" height="900" fill="url(#reward_dither)"/>
          <g filter="url(#reward_pixel_glow)">
            <rect width="1600" height="900" fill="url(#reward_centerSpot)"/>
          </g>

          <rect x="16" y="16" width="1568" height="868" fill="none" stroke="#4A3E2A" strokeWidth="8"/>
          <rect x="24" y="24" width="1552" height="852" fill="none" stroke="#1A1A1A" strokeWidth="8"/>
          
          <rect x="16" y="16" width="24" height="24" fill="#E3B86A"/>
          <rect x="1560" y="16" width="24" height="24" fill="#E3B86A"/>
          <rect x="16" y="860" width="24" height="24" fill="#E3B86A"/>
          <rect x="1560" y="860" width="24" height="24" fill="#E3B86A"/>
          
          <rect x="20" y="20" width="16" height="16" fill="#F1C40F"/>
          <rect x="1564" y="20" width="16" height="16" fill="#F1C40F"/>
          <rect x="20" y="864" width="16" height="16" fill="#F1C40F"/>
          <rect x="1564" y="864" width="16" height="16" fill="#F1C40F"/>
        </svg>

        <div className="banner-content flex flex-col items-center justify-center gap-4">
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
          <div className="flex items-center gap-4 opacity-50" style={{ fontSize: '0.8em' }}>
            <span style={{ color: colors.textMuted }}>━━━━━</span>
            <span className="text-xl text-yellow-400 flex items-center justify-center">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20 20H8v-2h12v2ZM8 18H6v-2H4v-2h2v-4h2v8Zm14 0h-2v-8h2v8Zm-6-2h-4v-4h4v4ZM4 14H2V6h2v8Zm14-6h2v2H8V8h8V6h2v2Zm-2-2H4V4h12v2Z"/></svg>
            </span>
            <span style={{ color: colors.textMuted }}>━━━━━</span>
          </div>

          {/* Main Title */}
          <div className="flex items-center gap-6">
            <motion.span
              className="text-3xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelStore size={36} className="text-yellow-400" />
            </motion.span>
            <motion.h1
              className="shop-title-glow font-bold tracking-wide"
              style={{ color: colors.textAccent, lineHeight: 1.2, fontSize: '2em' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {t("rewardShop.title")}
            </motion.h1>
            <motion.span
              className="text-3xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelGem size={36} className="text-yellow-400" />
            </motion.span>
          </div>

          {/* Marquee Subtitle */}
          <div className="marquee-container opacity-60">
            <div 
              className="uppercase tracking-[0.2em]" 
              style={{
                color: colors.textMuted,
                textAlign: "center",
                fontSize: i18n.language === "th" ? "20px" : "20px", 
              }}
            >
              {t("rewardBanner.marquee", "✦ Legendary valuable items ✦ Rare merchandise ✦ Limited Edition Items ✦ Exclusive Rewards ✦")}
            </div>
          </div>

          {/* Description line */}
          <p 
            className="text-foreground/80 text-center max-w-md mt-2" 
            style={{
              fontSize: i18n.language === "th" ? "1em" : "0.8em", 
            }}
          >
            {t("rewardBanner.description", "Trade your hard-earned gold for items.")}
          </p>

          {/* Bottom line decoration */}
          <div className="flex gap-3 mt-2" style={{ fontSize: '1em' }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-accent"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              >
                ★
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardBanner;