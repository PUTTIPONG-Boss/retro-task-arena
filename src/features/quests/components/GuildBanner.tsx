import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sword } from "lucide-react";
import PixelHeart from "@/components/icons/PixelHeart";

const EnhancedGuildBanner = () => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[20px]" : "text-[20px]";

  const particleCount = 15;
  const [particles] = useState(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: Math.random() > 0.5 ? 0.25 : 0.15,
      rotation: Math.random() * 360,
    }))
  );

  const colors = {
    bg: "#1a1a1a",
    border: "#4a3e2a",
    textAccent: "#e3b86a",
    textMuted: "#6a6a6a",
    shadow: "#00000033",
    glow: "#f1c40f",
  };

  const styleTag = `
    @font-face {
      font-family: 'TA_8bit';
      src: url('/fonts/TA_8bit.otf') format('opentype');
    }

    .retro-banner {
      -webkit-font-smoothing: none;
      font-smooth: never;
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 10px 20px ${colors.shadow};
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
    .pixel-corner { font-size: 0.4em; color: ${colors.textAccent}aa; position: absolute; opacity: 0.5; z-index: 20; }
    .pixel-star { font-size: 0.6em; margin: 0 4px; }
    
    .deco-line { font-size: 0.5em; color: ${colors.textMuted}; }
    .deco-icon { font-size: 0.8em; color: ${colors.textMuted}; }
    
    .title-icon { font-size: 1em; }
    .title-text { font-size: 2em; line-height: 1.2; }
    .subtitle-text { font-size: 1em; letter-spacing: 0.3em; }
    /* -------------------------------------- */

    .pixel-border-top, .pixel-border-bottom {
      height: 2px;
      background: ${colors.textAccent};
      width: 80%;
      position: absolute;
      left: 10%;
      z-index: 20;
    }
    .pixel-border-top { top: 6px; }
    .pixel-border-bottom { bottom: 6px; }

    .title-glow {
      text-shadow: 0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}44;
    }

    .scrolling-text-container {
      overflow: hidden;
      width: 80%;
      margin: 0 auto;
      text-align: center;
    }
  `;

  return (
    <>
      <style>{styleTag}</style>

      <div className={`retro-banner p-10 flex flex-col items-center justify-center gap-4 ${fontClass}`}>
        {/* Custom SVG Background */}
        <svg 
          className="banner-svg"
          viewBox="0 0 1600 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="banner_baseBg" x1="800" y1="0" x2="800" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1A1A1A"/>
              <stop offset="1" stopColor="#0A0A0A"/>
            </linearGradient>

            <filter id="banner_pixel_glow" x="0" y="0">
              <feFlood x="4" y="4" height="2" width="2"/>
              <feComposite width="8" height="8"/>
              <feTile result="a"/>
              <feComposite in="SourceGraphic" in2="a" operator="in"/>
              <feMorphology operator="dilate" radius="2"/>
            </filter>

            <radialGradient id="banner_centerSpot" cx="0.5" cy="0.5" r="0.6">
              <stop stopColor="#F1C40F" stopOpacity="0.12"/>
              <stop offset="0.4" stopColor="#E3B86A" stopOpacity="0.05"/>
              <stop offset="0.8" stopColor="#1A1A1A" stopOpacity="0"/>
            </radialGradient>

            <pattern id="banner_dither" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="transparent"/>
              <rect x="0" y="0" width="4" height="4" fill="#000000" fillOpacity="0.3"/>
              <rect x="4" y="4" width="4" height="4" fill="#000000" fillOpacity="0.3"/>
              <rect x="0" y="4" width="2" height="2" fill="#4A3E2A" fillOpacity="0.1"/>
            </pattern>

            <pattern id="banner_pixelWall" width="128" height="64" patternUnits="userSpaceOnUse">
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

          <rect width="1600" height="900" fill="url(#banner_baseBg)"/>
          <rect width="1600" height="900" fill="url(#banner_pixelWall)"/>
          <rect width="1600" height="900" fill="url(#banner_dither)"/>
          <g filter="url(#banner_pixel_glow)">
            <rect width="1600" height="900" fill="url(#banner_centerSpot)"/>
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

        {/* เส้นขอบบน-ล่าง แบบเดียวกับ RankingBanner */}
        <div className="pixel-border-top"></div>
        <div className="pixel-border-bottom"></div>

        <div className="banner-content flex flex-col items-center justify-center gap-4">
          <div className="pixel-corner top-2 left-3">┌─</div>
          <div className="pixel-corner top-2 right-3">─┐</div>
          <div className="pixel-corner bottom-2 left-3">└─</div>
          <div className="pixel-corner bottom-2 right-3">─┘</div>

          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="pixel-coin absolute text-accent"
              style={{
                left: p.left,
                bottom: "10%",
                fontSize: `${p.size}em`,
                color: colors.textAccent,
                pointerEvents: "none",
              }}
              animate={{
                y: [0, -100, -150],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 0.8, 0],
                scale: [0.3, 1, 0.2],
                rotate: [0, p.rotation, p.rotation * 2],
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

          <div className="flex items-center gap-6">
            <motion.span
              className="title-icon"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <Sword size={30} className="text-yellow-400" />
            </motion.span>
            <motion.h1
              className="title-glow font-bold tracking-wide"
              style={{ color: colors.textAccent, fontSize: '2em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {t("questBoard.title")}
            </motion.h1>
            <motion.span
              className="title-icon"
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <PixelHeart size={30} className="text-yellow-400" />
            </motion.span>
          </div>

          <div className="scrolling-text-container">
            <span
              className="scrolling-text subtitle-text uppercase"
              style={{ color: colors.textMuted }}
            >
              {t("questBoard.subtitle")}
            </span>
          </div>

          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="pixel-star"
                style={{ color: colors.textAccent }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
              >
                ✦
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedGuildBanner;