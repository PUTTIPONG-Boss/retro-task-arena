import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelSword from "@/components/icons/PixelSword";

// ── Pixel-art nail (same as GuildBannerLight) ─────────────────────────────────
const Nail = ({ cx, cy, r = 9 }: { cx: number; cy: number; r?: number }) => (
  <>
    <rect x={cx - r - 1} y={cy - r - 1} width={r * 2 + 2} height={r * 2 + 2} fill="#2D0F00" />
    <rect x={cx - r}     y={cy - r}     width={r * 2}     height={r * 2}     fill="#7A4A1A" />
    <rect x={cx - r + 2} y={cy - r + 2} width={r * 2 - 4} height={r * 2 - 4} fill="#C88020" />
    <rect x={cx - r + 4} y={cy - r + 4} width={r * 2 - 8} height={r * 2 - 8} fill="#FFD700" />
    <rect x={cx - r + 6} y={cy - r + 6} width={r * 2 - 12} height={r * 2 - 12} fill="#FFFACD" />
  </>
);

// ── One horizontal plank (same as GuildBannerLight) ───────────────────────────
const Plank = ({ y, h, light }: { y: number; h: number; light: boolean }) => (
  <>
    <rect x={0} y={y}         width={1600} height={h} fill={light ? "#B87840" : "#9B6230"} />
    <rect x={0} y={y + 4}     width={1600} height={3} fill={light ? "#C88A50" : "#A87040"} opacity={0.6} />
    <rect x={0} y={y + 18}    width={1600} height={2} fill="#7A4A20" opacity={0.35} />
    <rect x={0} y={y + 32}    width={1600} height={2} fill="#7A4A20" opacity={0.25} />
    <rect x={0} y={y + h - 3} width={1600} height={3} fill="#7A4520" opacity={0.45} />
  </>
);

// ── Layout constants ──────────────────────────────────────────────────────────
const PLANK_H     = 44;
const DIV         = 2;
const PLANKS      = Array.from({ length: 6 }, (_, i) => ({ y: 23 + i * (PLANK_H + DIV), light: i % 2 === 0 }));
const RAIL_NAILS  = [400, 800, 1200];

const RankingBannerLight = () => {
  const { t } = useTranslation();

  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${8 + Math.random() * 84}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: Math.random() > 0.5 ? 0.22 : 0.15,
      rotation: Math.random() * 360,
      symbol: ["✦", "♦", "✦"][Math.floor(Math.random() * 3)],
    }))
  );

  return (
    <>
      <style>{`
        .lt-rb-banner {
          position: relative; overflow: hidden; -webkit-font-smoothing: none; font-smooth: never;
          box-shadow: 0 8px 28px rgba(45,15,0,0.55), inset 0 1px 0 rgba(200,140,64,0.25);
        }
        .lt-rb-content { position: relative; z-index: 10; }
        .lt-rb-svg     { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .lt-rb-title   { color: #FFD700; text-shadow: 2px 2px 0 #5C3000, 0 0 12px #FFD70066; }
        .lt-rb-deco    { color: #C88020; font-size: 0.52em; }
        .lt-rb-sub     { color: #ffffff; font-size: 0.95em; opacity: 0.85; }
      `}</style>

      <div className="lt-rb-banner p-10 flex flex-col items-center justify-center gap-3 text-[20px]">

        {/* ── SVG wooden board background ──────────────────── */}
        <svg
          className="lt-rb-svg"
          viewBox="0 0 1600 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
        >
          {PLANKS.map((p, i) => <Plank key={i} y={p.y} h={PLANK_H} light={p.light} />)}

          {PLANKS.slice(0, -1).map((p, i) => (
            <rect key={i} x={0} y={p.y + PLANK_H} width={1600} height={DIV} fill="#4A2010" />
          ))}

          {/* Frame: top rail */}
          <rect x={0} y={0}   width={1600} height={23} fill="#5C3317" />
          <rect x={0} y={20}  width={1600} height={3}  fill="#3D1F0A" />
          <rect x={0} y={23}  width={1600} height={2}  fill="#C88040" opacity={0.35} />

          {/* Frame: bottom rail */}
          <rect x={0} y={297} width={1600} height={23} fill="#5C3317" />
          <rect x={0} y={297} width={1600} height={3}  fill="#3D1F0A" />
          <rect x={0} y={295} width={1600} height={2}  fill="#C88040" opacity={0.25} />

          {/* Frame: left post */}
          <rect x={0}    y={0} width={23} height={320} fill="#4A2810" />
          <rect x={20}   y={0} width={3}  height={320} fill="#3D1F0A" />
          <rect x={23}   y={0} width={2}  height={320} fill="#C88040" opacity={0.3} />

          {/* Frame: right post */}
          <rect x={1577} y={0} width={23} height={320} fill="#4A2810" />
          <rect x={1577} y={0} width={3}  height={320} fill="#3D1F0A" />
          <rect x={1575} y={0} width={2}  height={320} fill="#C88040" opacity={0.25} />

          {/* Corner nails (large) */}
          <Nail cx={11}   cy={11}  r={9} />
          <Nail cx={1589} cy={11}  r={9} />
          <Nail cx={11}   cy={309} r={9} />
          <Nail cx={1589} cy={309} r={9} />

          {/* Rail nails */}
          {RAIL_NAILS.map(x => <Nail key={`t${x}`} cx={x} cy={11}  r={6} />)}
          {RAIL_NAILS.map(x => <Nail key={`b${x}`} cx={x} cy={309} r={6} />)}

          {/* Post centre nails */}
          <Nail cx={11}   cy={160} r={6} />
          <Nail cx={1589} cy={160} r={6} />

          {/* Vignette */}
          <rect x={0} y={0} width={1600} height={320} fill="url(#lt_rb_vig)" opacity={0.18} />
          <defs>
            <radialGradient id="lt_rb_vig" cx="0.5" cy="0.5" r="0.75">
              <stop offset="0.4" stopColor="transparent" />
              <stop offset="1"   stopColor="#1A0800" />
            </radialGradient>
          </defs>
        </svg>

        {/* ── Floating gold sparks ─────────────────────────── */}
        {particles.map(p => (
          <motion.span
            key={p.id}
            className="absolute pointer-events-none"
            style={{ left: p.left, bottom: "8%", fontSize: `${p.size}em`, color: "#D4A800" }}
            animate={{ y: [0, -80, -130], opacity: [0, 0.9, 0], scale: [0.4, 1, 0.2], rotate: [0, p.rotation] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
          >
            {p.symbol}
          </motion.span>
        ))}

        {/* ── Banner content ───────────────────────────────── */}
        <div className="lt-rb-content flex flex-col items-center gap-4">

          <div className="lt-rb-deco flex items-center gap-2">
            <span>▬▬▬</span>
            <span style={{ fontSize: "1.4em", color: "#FFD700" }}>⚜</span>
            <span>▬▬▬</span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-6">
            <motion.span
              animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 1.2, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <PixelTrophy size={30} className="text-yellow-400" />
            </motion.span>

            <motion.h1
              className="lt-rb-title font-pixel font-bold tracking-wide"
              style={{ fontSize: "2em" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t("ranking.banner.title")}
            </motion.h1>

            <motion.span
              animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 1.2, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <PixelSword size={30} className="text-yellow-400" />
            </motion.span>
          </div>

          {/* Subtitle */}
          <span className="lt-rb-sub font-pixel uppercase tracking-widest text-center max-w-[80%] leading-relaxed">
            {t("ranking.banner.subtitle")}
          </span>

          {/* Stars */}
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.span
                key={i}
                className="font-pixel"
                style={{ color: "#D4A800", fontSize: "0.6em" }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.6, delay: i * 0.28, repeat: Infinity, ease: "easeInOut" }}
              >✦</motion.span>
            ))}
          </div>

          <div className="lt-rb-deco flex items-center gap-2">
            <span>▬▬▬</span>
            <span style={{ fontSize: "1.4em", color: "#FFD700" }}>⚜</span>
            <span>▬▬▬</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RankingBannerLight;
