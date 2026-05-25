import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelSword from "@/components/icons/PixelSword";

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

const RankingBannerDark = () => {
  const [particles] = useState<Particle[]>(generateParticles);
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        .dk-rb-banner { position: relative; overflow: hidden; -webkit-font-smoothing: none; font-smooth: never; }
        .dk-rb-content { position: relative; z-index: 10; }
        .dk-rb-svg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; object-fit: cover; }
        .dk-rb-line-top, .dk-rb-line-bottom {
          height: 2px; background: #e3b86a; width: 80%; position: absolute; left: 10%; z-index: 20;
        }
        .dk-rb-line-top    { top: 6px; }
        .dk-rb-line-bottom { bottom: 6px; }
        .dk-rb-corner { font-size: 0.4em; color: #e3b86aaa; position: absolute; opacity: 0.5; z-index: 20; }
        .dk-rb-title-glow { text-shadow: 0 0 10px #f1c40f, 0 0 20px #f1c40f44; }
        .dk-rb-star { font-size: 0.6em; margin: 0 4px; }
        .dk-rb-deco { font-size: 0.5em; color: #6a6a6a; }
      `}</style>

      <div className="dk-rb-banner p-10 flex flex-col items-center justify-center gap-4 text-[20px]">

        {/* ── SVG dark brick background ──────────────────────── */}
        <svg
          className="dk-rb-svg"
          viewBox="0 0 1600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dk_rb_bg" x1="800" y1="0" x2="800" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1A1A1A" />
              <stop offset="1" stopColor="#0A0A0A" />
            </linearGradient>
            <radialGradient id="dk_rb_spot" cx="0.5" cy="0.5" r="0.6">
              <stop stopColor="#F1C40F" stopOpacity="0.12" />
              <stop offset="0.4" stopColor="#E3B86A" stopOpacity="0.05" />
              <stop offset="0.8" stopColor="#1A1A1A" stopOpacity="0" />
            </radialGradient>
            <pattern id="dk_rb_wall" width="128" height="64" patternUnits="userSpaceOnUse">
              <rect width="128" height="64" fill="#151515" />
              <rect x="0"   y="0"  width="62" height="30" fill="#1C1C1C" />
              <rect x="64"  y="0"  width="62" height="30" fill="#181818" />
              <rect x="-32" y="32" width="62" height="30" fill="#1A1A1A" />
              <rect x="32"  y="32" width="62" height="30" fill="#1E1E1E" />
              <rect x="96"  y="32" width="62" height="30" fill="#171717" />
              <path d="M0 0H62 M64 0H126 M-32 32H30 M32 32H94" stroke="#252525" strokeWidth="2" />
              <path d="M0 30H62 M64 30H126 M-32 62H30 M32 62H94" stroke="#0F0F0F" strokeWidth="2" />
            </pattern>
          </defs>

          <rect width="1600" height="400" fill="url(#dk_rb_bg)" />
          <rect width="1600" height="400" fill="url(#dk_rb_wall)" />
          <rect width="1600" height="400" fill="url(#dk_rb_spot)" />

          <rect x="16"   y="10"  width="1568" height="380" fill="none" stroke="#4A3E2A" strokeWidth="8" />
          <rect x="22"   y="16"  width="1556" height="368" fill="none" stroke="#1A1A1A" strokeWidth="6" />

          <rect x="16"   y="10"  width="20" height="20" fill="#E3B86A" />
          <rect x="1564" y="10"  width="20" height="20" fill="#E3B86A" />
          <rect x="16"   y="370" width="20" height="20" fill="#E3B86A" />
          <rect x="1564" y="370" width="20" height="20" fill="#E3B86A" />
          <rect x="19"   y="13"  width="14" height="14" fill="#F1C40F" />
          <rect x="1567" y="13"  width="14" height="14" fill="#F1C40F" />
          <rect x="19"   y="373" width="14" height="14" fill="#F1C40F" />
          <rect x="1567" y="373" width="14" height="14" fill="#F1C40F" />
        </svg>

        <div className="dk-rb-line-top" />
        <div className="dk-rb-line-bottom" />
        <span className="dk-rb-corner top-2 left-3">┌─</span>
        <span className="dk-rb-corner top-2 right-3">─┐</span>
        <span className="dk-rb-corner bottom-2 left-3">└─</span>
        <span className="dk-rb-corner bottom-2 right-3">─┘</span>

        {/* ── Floating particles ───────────────────────────── */}
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

        {/* ── Banner content ───────────────────────────────── */}
        <div className="dk-rb-content flex flex-col items-center gap-4">

          <div className="flex items-center gap-3">
            <span className="dk-rb-deco">━━━</span>
            <span style={{ color: "#6a6a6a" }}>⚜</span>
            <span className="dk-rb-deco">━━━</span>
          </div>

          <div className="flex items-center gap-6">
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <PixelTrophy size={30} className="text-yellow-400" />
            </motion.span>

            <motion.h1
              className="dk-rb-title-glow font-pixel font-bold tracking-wide"
              style={{ color: "#e3b86a", fontSize: "2em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t("ranking.banner.title")}
            </motion.h1>

            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <PixelSword size={30} className="text-yellow-400" />
            </motion.span>
          </div>

          <p
            className="font-pixel uppercase tracking-widest text-center text-[1em] max-w-[80%] leading-relaxed"
            style={{ color: "#6a6a6a" }}
          >
            {t("ranking.banner.subtitle")}
          </p>

          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="dk-rb-star"
                style={{ color: "#e3b86a" }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
              >
                ✦
              </motion.span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="dk-rb-deco">━━━</span>
            <span style={{ color: "#6a6a6a" }}>⚜</span>
            <span className="dk-rb-deco">━━━</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RankingBannerDark;
