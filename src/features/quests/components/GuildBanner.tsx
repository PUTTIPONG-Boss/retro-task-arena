import { motion } from "framer-motion";

const GuildBanner = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
    size: Math.random() > 0.5 ? "text-[6px]" : "text-[4px]",
  }));

  return (
    <div className="relative w-full overflow-hidden pixel-border bg-secondary">
      {/* Pixel corner decorations */}
      <div className="absolute top-2 left-3 font-pixel text-[8px] text-muted-foreground/30">┌─</div>
      <div className="absolute top-2 right-3 font-pixel text-[8px] text-muted-foreground/30">─┐</div>
      <div className="absolute bottom-2 left-3 font-pixel text-[8px] text-muted-foreground/30">└─</div>
      <div className="absolute bottom-2 right-3 font-pixel text-[8px] text-muted-foreground/30">─┘</div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute ${p.size} text-accent/40 pointer-events-none`}
          style={{ left: p.left, bottom: "10%" }}
          animate={{
            y: [0, -60, -100],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          ✦
        </motion.span>
      ))}

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center py-10 gap-2">
        {/* Decorative top line */}
        <div className="flex items-center gap-3 mb-1">
          <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
          <span className="text-lg text-muted-foreground/60">⚜</span>
          <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
        </div>

        {/* Title row */}
        <div className="flex items-center gap-4">
          <span className="text-2xl">⚔</span>
          <h1 className="font-pixel text-[18px] sm:text-[22px] text-accent pixel-text-shadow text-center leading-relaxed">
            Quest Board
          </h1>
          <span className="text-2xl">🛡</span>
        </div>

        {/* Subtitle */}
        <p className="font-pixel text-[8px] text-muted-foreground tracking-[0.3em] uppercase">
          ── Inet Quest Board ──
        </p>

        {/* Blinking stars */}
        <div className="flex gap-2 mt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="animate-blink-star text-accent/70 text-sm"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="flex items-center gap-3 mt-1">
          <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
          <span className="text-lg text-muted-foreground/60">⚜</span>
          <span className="font-pixel text-[10px] text-muted-foreground/50">━━━</span>
        </div>
      </div>
    </div>
  );
};

export default GuildBanner;
