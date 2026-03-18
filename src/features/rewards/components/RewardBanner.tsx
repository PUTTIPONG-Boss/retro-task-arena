import React, { useMemo } from "react";
import { motion } from "framer-motion";

const RewardBanner = () => {
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

  const styleTag = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    .retro-banner-shop {
      font-family: 'VT323', monospace;
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

    // .marquee-text {
    //   display: inline-block;
    //   padding-left: 100%;
    //   animation: marquee-slide 20s linear infinite;
    // }

    @keyframes marquee-slide {
      0% { transform: translate(0, 0); }
      100% { transform: translate(-100%, 0); }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div className="retro-banner-shop p-10 flex flex-col items-center justify-center gap-4 my-4">
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
            className="text-4xl text-accent shop-title-glow"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Inet Reward Shop
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
          <div className="marquee-text font-pixel uppercase tracking-[0.2em] text-[10px]" style={{
            color: colors.textMuted,
            textAlign: "center",
          }}>
            ✦ Legendary valuable items ✦ Rare merchandise ✦ Limited Edition Items ✦ Exclusive Rewards ✦
          </div>
        </div>

        {/* Description line */}
        <p className="font-pixel-body text-lg text-foreground/80 text-center max-w-md" style={{

          fontSize: "20px",
        }}>
          Trade your hard-earned gold for items.
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
