import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelSword from "@/components/icons/PixelSword";

// ─── Particle config ──────────────────────────────────────────────────────────
const PARTICLE_COUNT = 15;

interface Particle {
    id: number;
    left: string;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
}

const generateParticles = (): Particle[] =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: Math.random() > 0.5 ? 0.25 : 0.15,
        rotation: Math.random() * 360,
    }));

// ─── Colors (ตรงกับ GuildBanner) ─────────────────────────────────────────────
const COLORS = {
    textAccent: "#e3b86a",
    textMuted: "#6a6a6a",
    glow: "#f1c40f",
};

// ─── Inline style ที่ต้องการ CSS class พิเศษ (ตาม pattern ของ GuildBanner) ────
const BANNER_STYLE = `
  .ranking-banner {
    -webkit-font-smoothing: none;
    font-smooth: never;
    position: relative;
    overflow: hidden;
  }
  .ranking-banner-content {
    position: relative;
    z-index: 10;
  }
  .ranking-banner-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    object-fit: cover;
  }
  .ranking-banner-line-top,
  .ranking-banner-line-bottom {
    height: 2px;
    background: ${COLORS.textAccent};
    width: 80%;
    position: absolute;
    left: 10%;
    z-index: 20;
  }
  .ranking-banner-line-top    { top: 6px; }
  .ranking-banner-line-bottom { bottom: 6px; }
  .ranking-corner {
    font-size: 0.4em;
    color: ${COLORS.textAccent}aa;
    position: absolute;
    opacity: 0.5;
    z-index: 20;
  }
  .ranking-title-glow {
    text-shadow: 0 0 10px ${COLORS.glow}, 0 0 20px ${COLORS.glow}44;
  }
  .ranking-star { font-size: 0.6em; margin: 0 4px; }
  .ranking-deco { font-size: 0.5em; color: ${COLORS.textMuted}; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
const RankingBanner = () => {
    const [particles] = useState<Particle[]>(generateParticles);
    const { t } = useTranslation();

    return (
        <>
            <style>{BANNER_STYLE}</style>

            <div className="ranking-banner p-10 flex flex-col items-center justify-center gap-4 text-[20px]">
                {/* SVG pixel-wall background (เหมือน GuildBanner) */}
                <svg
                    className="ranking-banner-svg"
                    viewBox="0 0 1600 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="rb_bg" x1="800" y1="0" x2="800" y2="400" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#1A1A1A" />
                            <stop offset="1" stopColor="#0A0A0A" />
                        </linearGradient>
                        <radialGradient id="rb_spot" cx="0.5" cy="0.5" r="0.6">
                            <stop stopColor="#F1C40F" stopOpacity="0.12" />
                            <stop offset="0.4" stopColor="#E3B86A" stopOpacity="0.05" />
                            <stop offset="0.8" stopColor="#1A1A1A" stopOpacity="0" />
                        </radialGradient>
                        <pattern id="rb_wall" width="128" height="64" patternUnits="userSpaceOnUse">
                            <rect width="128" height="64" fill="#151515" />
                            <rect x="0" y="0" width="62" height="30" fill="#1C1C1C" />
                            <rect x="64" y="0" width="62" height="30" fill="#181818" />
                            <rect x="-32" y="32" width="62" height="30" fill="#1A1A1A" />
                            <rect x="32" y="32" width="62" height="30" fill="#1E1E1E" />
                            <rect x="96" y="32" width="62" height="30" fill="#171717" />
                            <path d="M0 0H62 M64 0H126 M-32 32H30 M32 32H94" stroke="#252525" strokeWidth="2" />
                            <path d="M0 30H62 M64 30H126 M-32 62H30 M32 62H94" stroke="#0F0F0F" strokeWidth="2" />
                        </pattern>
                    </defs>

                    {/* Layers */}
                    <rect width="1600" height="400" fill="url(#rb_bg)" />
                    <rect width="1600" height="400" fill="url(#rb_wall)" />
                    <rect width="1600" height="400" fill="url(#rb_spot)" />

                    {/* ขอบ pixel-art frame */}
                    <rect x="16" y="10" width="1568" height="380" fill="none" stroke="#4A3E2A" strokeWidth="8" />
                    <rect x="22" y="16" width="1556" height="368" fill="none" stroke="#1A1A1A" strokeWidth="6" />

                    {/* มุม 4 มุม */}
                    <rect x="16" y="10" width="20" height="20" fill="#E3B86A" />
                    <rect x="1564" y="10" width="20" height="20" fill="#E3B86A" />
                    <rect x="16" y="370" width="20" height="20" fill="#E3B86A" />
                    <rect x="1564" y="370" width="20" height="20" fill="#E3B86A" />
                    <rect x="19" y="13" width="14" height="14" fill="#F1C40F" />
                    <rect x="1567" y="13" width="14" height="14" fill="#F1C40F" />
                    <rect x="19" y="373" width="14" height="14" fill="#F1C40F" />
                    <rect x="1567" y="373" width="14" height="14" fill="#F1C40F" />
                </svg>

                {/* เส้นขอบบน-ล่าง */}
                <div className="ranking-banner-line-top" />
                <div className="ranking-banner-line-bottom" />

                {/* มุมตัวอักษร pixel */}
                <span className="ranking-corner top-2 left-3">┌─</span>
                <span className="ranking-corner top-2 right-3">─┐</span>
                <span className="ranking-corner bottom-2 left-3">└─</span>
                <span className="ranking-corner bottom-2 right-3">─┘</span>

                {/* Floating particles */}
                {particles.map((p) => (
                    <motion.span
                        key={p.id}
                        className="absolute pointer-events-none text-accent"
                        style={{ left: p.left, bottom: "10%", fontSize: `${p.size}em` }}
                        animate={{ y: [0, -100, -150], opacity: [0, 0.8, 0], scale: [0.3, 1, 0.2], rotate: [0, p.rotation, p.rotation * 2] }}
                        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
                    >
                        ●
                    </motion.span>
                ))}

        {/* Banner content */}
        <div className="ranking-banner-content flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="ranking-deco">━━━</span>
            <span style={{ color: COLORS.textMuted }}>⚜</span>
            <span className="ranking-deco">━━━</span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-6">
            <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}>
              <PixelTrophy size={30} className="text-yellow-400" />
            </motion.span>

            <motion.h1
              className="ranking-title-glow font-pixel font-bold tracking-wide"
              style={{ color: COLORS.textAccent, fontSize: "2em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t("ranking.banner.title")}
            </motion.h1>

            <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}>
              <PixelSword size={30} className="text-yellow-400" />
            </motion.span>
          </div>

          {/* Subtitle */}
          <p className="font-pixel uppercase tracking-widest text-center text-[1em] max-w-[80%] leading-relaxed" style={{ color: COLORS.textMuted }}>
            {t("ranking.banner.subtitle")}
          </p>

                    {/* Animated stars */}
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.span
                                key={i}
                                className="ranking-star"
                                style={{ color: COLORS.textAccent }}
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
                            >
                                ✦
                            </motion.span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="ranking-deco">━━━</span>
                        <span style={{ color: COLORS.textMuted }}>⚜</span>
                        <span className="ranking-deco">━━━</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RankingBanner;