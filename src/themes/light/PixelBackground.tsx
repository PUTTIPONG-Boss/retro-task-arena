import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Layer { src: string; speed: number; alignBottom: boolean }

// Quest board — normal speed, scroll left
const DEFAULT_LAYERS: Layer[] = [
  { src: "/assets/bg/windrise-bg-sky.png",   speed: 0.008, alignBottom: false },
  { src: "/assets/bg/windrise-bg-cliff.png", speed: 0.022, alignBottom: true  },
  { src: "/assets/bg/windrise-bg-tree.png",  speed: 0.038, alignBottom: true  },
  { src: "/assets/bg/windrise-bg-front.png", speed: 0.065, alignBottom: true  },
];

// Reward shop — slower, scroll RIGHT, warm golden dusk tone
const REWARD_LAYERS: Layer[] = [
  { src: "/assets/bg/windrise-bg-sky.png",   speed: 0.005, alignBottom: false },
  { src: "/assets/bg/windrise-bg-cliff.png", speed: 0.013, alignBottom: true  },
  { src: "/assets/bg/windrise-bg-tree.png",  speed: 0.022, alignBottom: true  },
  { src: "/assets/bg/windrise-bg-front.png", speed: 0.036, alignBottom: true  },
];

const FADE_RATIO = 0.10;

function buildOffscreen(img: HTMLImageElement, tileW: number): HTMLCanvasElement {
  const scale = tileW / img.naturalWidth;
  const tileH = Math.ceil(img.naturalHeight * scale);
  const oc    = document.createElement("canvas");
  oc.width    = tileW;
  oc.height   = tileH;
  const octx  = oc.getContext("2d")!;
  octx.imageSmoothingEnabled = false;
  octx.drawImage(img, 0, 0, tileW, tileH);

  const FADE = tileW * FADE_RATIO;
  octx.globalCompositeOperation = "destination-out";

  const lg = octx.createLinearGradient(0, 0, FADE, 0);
  lg.addColorStop(0, "rgba(0,0,0,1)");
  lg.addColorStop(1, "rgba(0,0,0,0)");
  octx.fillStyle = lg;
  octx.fillRect(0, 0, FADE, tileH);

  const rg = octx.createLinearGradient(tileW - FADE, 0, tileW, 0);
  rg.addColorStop(0, "rgba(0,0,0,0)");
  rg.addColorStop(1, "rgba(0,0,0,1)");
  octx.fillStyle = rg;
  octx.fillRect(tileW - FADE, 0, FADE, tileH);

  octx.globalCompositeOperation = "source-over";
  return oc;
}

// ── Floating particle for reward shop ────────────────────────
interface Particle {
  x: number; y: number;
  vy: number; size: number;
  opacity: number; color: string;
  symbol: number; // 0=circle, 1=diamond, 2=star
}

const PARTICLE_COLORS = ["#F59E0B", "#FCD34D", "#60A5FA", "#FB923C", "#FDE68A"];

function initParticles(count: number, cw: number, ch: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * cw,
    y: Math.random() * ch,
    vy: 0.3 + Math.random() * 0.5,
    size: 2 + Math.random() * 4,
    opacity: Math.random(),
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    symbol: Math.floor(Math.random() * 3),
  }));
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle   = p.color;

  if (p.symbol === 0) {
    // circle (coin)
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.symbol === 1) {
    // diamond (gem)
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.size * 1.4);
    ctx.lineTo(p.x + p.size, p.y);
    ctx.lineTo(p.x, p.y + p.size * 1.4);
    ctx.lineTo(p.x - p.size, p.y);
    ctx.closePath();
    ctx.fill();
  } else {
    // pixel square (sparkle)
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
const PixelBackgroundLight = () => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const offscreenRef = useRef<(HTMLCanvasElement | null)[]>(
    [...DEFAULT_LAYERS, ...REWARD_LAYERS.slice(0, 0)].map(() => null)
  );
  const particlesRef = useRef<Particle[]>([]);
  const location     = useLocation();

  const isRewardShop = location.pathname === "/reward-shop";
  const LAYERS = isRewardShop ? REWARD_LAYERS : DEFAULT_LAYERS;

  // Load all images once (same 4 sources for both modes)
  useEffect(() => {
    if (imagesRef.current.length === DEFAULT_LAYERS.length) return;
    imagesRef.current = DEFAULT_LAYERS.map(({ src }, idx) => {
      const img = new Image();
      img.src   = src;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const cw = canvas.width / (window.devicePixelRatio || 1);
        if (cw > 0) offscreenRef.current[idx] = buildOffscreen(img, cw);
      };
      return img;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rebuildOffscreens = (cw: number) => {
      imagesRef.current.forEach((img, i) => {
        if (img.complete && img.naturalWidth > 0) {
          offscreenRef.current[i] = buildOffscreen(img, cw);
        }
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildOffscreens(window.innerWidth);
      // Init particles sized to viewport
      if (isRewardShop) {
        particlesRef.current = initParticles(28, window.innerWidth, window.innerHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let startTime: number | null = null;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const t   = (timestamp - startTime) * 0.001;
      const dpr = window.devicePixelRatio || 1;
      const cw  = canvas.width  / dpr;
      const ch  = canvas.height / dpr;

      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;

      // Ground fill
      ctx.fillStyle = isRewardShop ? "#3D2010" : "#1C3A10";
      ctx.fillRect(0, 0, cw, ch);

      LAYERS.forEach(({ speed, alignBottom }, i) => {
        const oc = offscreenRef.current[i];
        if (!oc) return;

        const tileW = oc.width;
        const tileH = oc.height;
        const FADE  = tileW * FADE_RATIO;
        const step  = tileW - FADE;
        const baseY = alignBottom ? ch - tileH : (ch - tileH) / 2;

        const rawOff = (t * speed * tileW) % step;

        // Reward shop scrolls RIGHT (reverse) — gives different feel
        const startX = isRewardShop
          ? rawOff - tileW                          // scroll right
          : -(rawOff + tileW);                      // scroll left (default)

        const numTiles = Math.ceil((cw + tileW * 2) / step) + 1;
        for (let k = 0; k < numTiles; k++) {
          ctx.drawImage(oc, startX + k * step, baseY);
        }
      });

      // ── Reward shop extras ──────────────────────────────────
      if (isRewardShop) {
        // 1. Warm golden dusk overlay
        const grad = ctx.createLinearGradient(0, 0, 0, ch);
        grad.addColorStop(0,   "rgba(251,146,60,0.18)");  // warm orange sky
        grad.addColorStop(0.5, "rgba(251,191,36,0.10)");  // golden mid
        grad.addColorStop(1,   "rgba(120,53,15,0.20)");   // warm brown ground
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);


        // 3. Floating gold/gem particles
        const pts = particlesRef.current;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          p.y -= p.vy;
          // fade in at bottom, fade out at top
          const progress = 1 - (p.y / ch);
          p.opacity = Math.sin(progress * Math.PI) * 0.75;

          if (p.y < -p.size * 2) {
            // reset to bottom
            p.x = Math.random() * cw;
            p.y = ch + p.size;
            p.vy = 0.3 + Math.random() * 0.5;
            p.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
          }
          drawParticle(ctx, p);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [location.pathname]);

  if (location.pathname === "/login") return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
};

export default PixelBackgroundLight;
