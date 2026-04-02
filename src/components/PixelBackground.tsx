import { useLocation } from "react-router-dom";
import { useState } from "react";

/**
 * Global animated background with custom SVG, 8-bit pixelate filter, and floating particles.
 * Excludes the login page.
 */
const PixelBackground = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Create mixed particles (Dust & Sparks)
  const [particles] = useState(() =>
    Array.from({ length: 40 }).map((_, i) => {
      const isSpark = Math.random() > 0.6; // 40% sparks, 60% dust
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 20}s`,
        duration: `${isSpark ? 5 + Math.random() * 5 : 12 + Math.random() * 10}s`,
        size: isSpark ? `${Math.random() * 2 + 1}px` : `${Math.random() * 4 + 2}px`,
        opacity: isSpark ? 0.6 + Math.random() * 0.4 : 0.1 + Math.random() * 0.3,
        color: isSpark
          ? (Math.random() > 0.5 ? "#f1c40f" : "#e67e22") // Gold or Orange spark
          : (Math.random() > 0.5 ? "#7f8c8d" : "#ecf0f1"), // Grey or White dust
        blur: isSpark ? "0px" : "1.5px",
        glow: isSpark ? "0 0 5px #f1c40f" : "none"
      };
    })
  );

  if (isLoginPage) return null;

  return (
    <div className="pixel-bg" aria-hidden="true">
      {/* Custom 8-bit SVG Background */}
      <svg
        className="pixel-bg-svg"
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="cave_bg" x1="800" y1="0" x2="800" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#171410" />
            <stop offset="0.45" stopColor="#12100d" />
            <stop offset="1" stopColor="#090b09" />
          </linearGradient>

          <filter id="cave_pixelate_filter" x="0" y="0">
            <feFlood x="2" y="2" height="1" width="1" />
            <feComposite width="4" height="4" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="2" />
          </filter>

          <radialGradient id="cave_centerGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(800 270) rotate(90) scale(260 700)">
            <stop stopColor="#3C311D" />
            <stop offset="1" stopColor="#3C311D" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cave_torchGlowL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 210) rotate(90) scale(220 260)">
            <stop stopColor="#D89D33" stopOpacity="0.3" />
            <stop offset="1" stopColor="#D89D33" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cave_torchGlowR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1380 210) rotate(90) scale(220 260)">
            <stop stopColor="#D89D33" stopOpacity="0.3" />
            <stop offset="1" stopColor="#D89D33" stopOpacity="0" />
          </radialGradient>

          <pattern id="cave_pixelNoise" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="transparent" />
            <rect x="1" y="2" width="2" height="2" fill="#2A241C" />
            <rect x="7" y="4" width="2" height="2" fill="#1E1A15" />
            <rect x="3" y="8" width="2" height="2" fill="#252018" />
            <rect x="9" y="10" width="1" height="1" fill="#3A3124" />
          </pattern>
          <pattern id="cave_stoneRow" width="96" height="48" patternUnits="userSpaceOnUse">
            <rect width="96" height="48" fill="#16130F" />
            <rect x="0" y="0" width="48" height="24" fill="#1A1612" />
            <rect x="48" y="0" width="48" height="24" fill="#14110D" />
            <rect x="16" y="24" width="48" height="24" fill="#191510" />
            <rect x="64" y="24" width="32" height="24" fill="#15120E" />
            <path d="M48 0V24M16 24H64M64 24V48" stroke="#241E17" strokeWidth="2" />
          </pattern>
          <linearGradient id="cave_floor" x1="800" y1="620" x2="800" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E110D" />
            <stop offset="1" stopColor="#090A08" />
          </linearGradient>
          <pattern id="cave_floorTile" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" fill="transparent" />
            <rect x="0" y="0" width="64" height="64" stroke="#171B15" strokeWidth="2" />
            <rect x="8" y="8" width="48" height="48" stroke="#11140F" strokeWidth="2" />
          </pattern>
        </defs>

        <rect width="1600" height="900" fill="url(#cave_bg)" />

        <rect width="1600" height="900" fill="url(#cave_pixelNoise)" opacity="0.55" />
        <rect width="1600" height="520" fill="url(#cave_stoneRow)" opacity="0.55" />

        <g filter="url(#cave_pixelate_filter)">
          <rect width="1600" height="900" fill="url(#cave_centerGlow)" opacity="0.8" />
          <rect width="1600" height="900" fill="url(#cave_torchGlowL)" />
          <rect width="1600" height="900" fill="url(#cave_torchGlowR)" />
        </g>

        <rect x="0" y="620" width="1600" height="280" fill="url(#cave_floor)" />
        <rect x="0" y="620" width="1600" height="280" fill="url(#cave_floorTile)" opacity="0.55" />

        <rect x="0" y="0" width="1600" height="900" fill="black" opacity="0.18" />
      </svg>

      {/* Floating Particles Overlay (Dust & Sparks) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="pixel-particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              backgroundColor: p.color,
              filter: `blur(${p.blur})`,
              boxShadow: p.glow
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PixelBackground;
