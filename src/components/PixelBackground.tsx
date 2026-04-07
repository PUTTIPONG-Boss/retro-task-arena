import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Global animated background with multiple themes and parallax effects.
 * - HomePage (/): Deep Dungeon theme with 2400px Parallax.
 * - Reward Shop: Tavern/Shop theme.
 * - Others: Cave theme.
 * - Login: Hidden.
 */
const PixelBackground = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isShopPage = location.pathname === "/reward-shop";
  const isHomePage = location.pathname === "/";

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as any;
      const top = target.scrollTop !== undefined ? target.scrollTop : window.scrollY;
      setScrollY(top || 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  // Shared Particles overlay (active for all themes except login)
  const [particles] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => {
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
      {isShopPage ? (
        /* ═══ THEME: SHOP / TAVERN ═══ */
        <svg
          className="pixel-bg-svg"
          viewBox="0 0 1600 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="shop_woodWall" width="64" height="64" patternUnits="userSpaceOnUse">
              <rect width="64" height="64" fill="#2C1A10" />
              <path d="M16 0V64 M48 0V64" stroke="#1A0F09" strokeWidth="2" />
              <rect x="24" y="20" width="8" height="2" fill="#1F120B" />
              <rect x="4" y="40" width="6" height="2" fill="#1F120B" />
              <rect x="52" y="10" width="6" height="2" fill="#1F120B" />
            </pattern>
            <pattern id="shop_counterWood" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#4A2E1B" />
              <rect x="0" y="0" width="32" height="4" fill="#5C3A21" />
              <rect x="0" y="16" width="32" height="4" fill="#3D2616" />
            </pattern>
            <radialGradient id="shop_lanternGlow" cx="0.5" cy="0.5" r="0.5">
              <stop stopColor="#F59E0B" stopOpacity="0.4">
                <animate attributeName="stop-opacity" values="0.3; 0.5; 0.35; 0.45; 0.3" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="0.6" stopColor="#D97706" stopOpacity="0.1" />
              <stop offset="1" stopColor="#2C1A10" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="shop_centerVignette" cx="0.5" cy="0.5" r="0.75">
              <stop stopColor="#1A0F09" stopOpacity="0.4" />
              <stop offset="1" stopColor="#0A0604" stopOpacity="0.8" />
            </radialGradient>
            <symbol id="shop_lantern" viewBox="-20 -10 40 60">
              <rect x="-8" y="0" width="16" height="4" fill="#1F2937" />
              <rect x="-4" y="4" width="8" height="6" fill="#D1D5DB" />
              <rect x="-12" y="10" width="24" height="24" fill="#FEF08A" stroke="#4B5563" strokeWidth="4" />
              <rect x="-4" y="18" width="8" height="10" fill="#F59E0B">
                <animate attributeName="height" values="10; 12; 8; 10" dur="0.5s" repeatCount="indefinite" />
              </rect>
              <rect x="-10" y="34" width="20" height="6" fill="#1F2937" />
            </symbol>
            <symbol id="shop_potion_red" viewBox="-20 -20 40 40">
              <rect x="-4" y="-16" width="8" height="6" fill="#D97706" />
              <rect x="-6" y="-10" width="12" height="4" fill="#9CA3AF" />
              <rect x="-12" y="-6" width="24" height="20" fill="#DC2626" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2" />
              <rect x="-8" y="-2" width="4" height="8" fill="#FCA5A5" />
            </symbol>
            <symbol id="shop_potion_blue" viewBox="-20 -20 40 40">
              <rect x="-4" y="-16" width="8" height="6" fill="#D97706" />
              <rect x="-6" y="-10" width="12" height="4" fill="#9CA3AF" />
              <rect x="-12" y="-6" width="24" height="20" fill="#2563EB" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2" />
              <rect x="-8" y="-2" width="4" height="8" fill="#93C5FD" />
            </symbol>
            <symbol id="shop_potion_green" viewBox="-20 -20 40 40">
              <rect x="-4" y="-16" width="8" height="6" fill="#D97706" />
              <rect x="-6" y="-10" width="12" height="4" fill="#9CA3AF" />
              <rect x="-12" y="-6" width="24" height="20" fill="#10B981" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="2" />
              <rect x="-8" y="-2" width="4" height="8" fill="#6EE7B7" />
            </symbol>
            <symbol id="shop_goldBag" viewBox="-20 -15 40 35">
              <rect x="-12" y="-4" width="24" height="20" fill="#B45309" rx="4" />
              <rect x="-8" y="-10" width="16" height="6" fill="#92400E" />
              <rect x="-14" y="-2" width="28" height="4" fill="#78350F" />
              <text x="0" y="12" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#FCD34D" textAnchor="middle">$</text>
            </symbol>
            <symbol id="shop_goldCoins" viewBox="-15 -10 30 20">
              <rect x="0" y="0" width="8" height="4" fill="#F59E0B" />
              <rect x="10" y="2" width="8" height="4" fill="#FBBF24" />
              <rect x="-8" y="2" width="8" height="4" fill="#D97706" />
              <rect x="4" y="-4" width="8" height="4" fill="#FCD34D" />
            </symbol>
            <symbol id="shop_spellBook" viewBox="-10 -25 50 40">
              <rect x="0" y="-20" width="12" height="24" fill="#4C1D95" />
              <rect x="12" y="-18" width="24" height="20" fill="#7C3AED" />
              <rect x="16" y="-10" width="8" height="4" fill="#FCD34D" />
              <rect x="36" y="-16" width="4" height="16" fill="#F3F4F6" />
            </symbol>
          </defs>
          <rect width="1600" height="900" fill="url(#shop_woodWall)" />
          <rect x="0" y="250" width="200" height="16" fill="#3D2616" stroke="#1A0F09" strokeWidth="4" />
          <rect x="0" y="500" width="240" height="16" fill="#3D2616" stroke="#1A0F09" strokeWidth="4" />
          <rect x="1400" y="250" width="200" height="16" fill="#3D2616" stroke="#1A0F09" strokeWidth="4" />
          <rect x="1360" y="500" width="240" height="16" fill="#3D2616" stroke="#1A0F09" strokeWidth="4" />
          <use href="#shop_potion_red" x="60" y="246" width="40" height="40" transform="scale(1.5) translate(-20, -10)" />
          <use href="#shop_potion_red" x="100" y="246" width="40" height="40" transform="scale(1.5) translate(-46, -10)" />
          <use href="#shop_spellBook" x="40" y="496" width="50" height="40" transform="scale(1.5) translate(-20, -52)" />
          <use href="#shop_potion_blue" x="140" y="496" width="40" height="40" transform="scale(1.5) translate(-86, -55)" />
          <use href="#shop_potion_green" x="1480" y="246" width="40" height="40" transform="scale(1.5) translate(-493, -10)" />
          <use href="#shop_goldBag" x="1460" y="496" width="40" height="35" transform="scale(1.5) translate(-480, -60)" />
          <use href="#shop_goldCoins" x="1500" y="496" width="30" height="20" transform="scale(1.5) translate(-506, -112)" />
          <g transform="translate(0, 750)">
            <rect width="1600" height="150" fill="url(#shop_counterWood)" />
            <rect width="1600" height="16" fill="#784421" />
            <rect y="16" width="1600" height="8" fill="#2C1A10" opacity="0.5" />
            <use href="#shop_goldBag" x="300" y="-4" width="40" height="35" transform="scale(2) translate(-150, 0)" />
            <use href="#shop_goldCoins" x="380" y="0" width="30" height="20" transform="scale(2) translate(-190, -4)" />
            <use href="#shop_spellBook" x="1250" y="-4" width="50" height="40" transform="scale(1.5) translate(-833, 0)" />
          </g>
          <rect x="100" y="0" width="8" height="100" fill="#1F2937" />
          <use href="#shop_lantern" x="104" y="100" width="40" height="60" transform="scale(1.5) translate(-34, -33)" />
          <rect x="54" y="50" width="600" height="600" fill="url(#shop_lanternGlow)" pointerEvents="none" />
          <rect x="1480" y="0" width="8" height="100" fill="#1F2937" />
          <use href="#shop_lantern" x="1484" y="100" width="40" height="60" transform="scale(1.5) translate(-989, -33)" />
          <rect x="1000" y="50" width="600" height="600" fill="url(#shop_lanternGlow)" pointerEvents="none" />
          <rect width="1600" height="900" fill="url(#shop_centerVignette)" pointerEvents="none" />
        </svg>
      ) : isHomePage ? (
        /* ═══ THEME: DEEP DUNGEON (2400px PARALLAX) ═══ */
        <div
          className="pixel-bg-svg-container"
          style={{
            transform: `translateY(${-scrollY * 0.3}px)`,
            height: '2400px',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <svg
            className="pixel-bg-svg"
            viewBox="0 0 1600 2400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMin slice"
          >
            <defs>
              <pattern id="deep_stoneRow" width="96" height="48" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
                <rect width="96" height="48" fill="#16130F" />
                <rect x="0" y="0" width="48" height="24" fill="#1A1612" />
                <rect x="48" y="0" width="48" height="24" fill="#14110D" />
                <rect x="16" y="24" width="48" height="24" fill="#191510" />
                <rect x="64" y="24" width="32" height="24" fill="#15120E" />

                <rect x="8" y="4" width="4" height="4" fill="#110E0B" />
                <rect x="36" y="12" width="8" height="4" fill="#0C0A07" />
                <rect x="40" y="16" width="4" height="8" fill="#0C0A07" />
                <rect x="56" y="8" width="4" height="4" fill="#0C0A07" />
                <rect x="80" y="16" width="4" height="4" fill="#0C0A07" />
                <rect x="24" y="32" width="4" height="8" fill="#110E0B" />
                <rect x="20" y="36" width="4" height="4" fill="#110E0B" />
                <rect x="76" y="28" width="8" height="4" fill="#0C0A07" />

                <path d="M48 0V24M16 24H64M64 24V48" stroke="#241E17" strokeWidth="2" />
              </pattern>

              <pattern id="deep_wallGrunge" width="256" height="256" patternUnits="userSpaceOnUse" shapeRendering="crispEdges">
                <path d="M120,40 h4 v8 h-4 v8 h-8 v12 h4 v8 h-4 v4" fill="#000000" opacity="0.3" />
                <rect x="40" y="150" width="12" height="4" fill="#000000" opacity="0.2" />
                <rect x="200" y="80" width="8" height="8" fill="#000000" opacity="0.3" />
              </pattern>

              <linearGradient id="deep_depthShadow" x1="800" y1="0" x2="800" y2="2400" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1A1612" stopOpacity="0.1" />
                <stop offset="0.35" stopColor="#0A0806" stopOpacity="0.85" />
                <stop offset="0.6" stopColor="#030201" stopOpacity="0.98" />
                <stop offset="0.85" stopColor="#240500" stopOpacity="0.85" />
                <stop offset="1" stopColor="#5A0C00" stopOpacity="0.7" />
              </linearGradient>

              <radialGradient id="deep_torchGlow" cx="0.5" cy="0.5" r="0.5">
                <stop stopColor="#C25317" stopOpacity="0.4">
                  <animate attributeName="stop-opacity" values="0.3; 0.5; 0.25; 0.45; 0.3" dur="1.8s" repeatCount="indefinite" />
                </stop>
                <stop offset="1" stopColor="#C25317" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="deep_agedTorchGlow" cx="0.5" cy="0.5" r="0.5">
                <stop stopColor="#9A3412" stopOpacity="0.25">
                  <animate attributeName="stop-opacity" values="0.1; 0.3; 0.05; 0.2; 0.1" dur="2.5s" repeatCount="indefinite" />
                </stop>
                <stop offset="1" stopColor="#7C2D12" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="deep_magmaGlow" cx="0.5" cy="1" r="0.6">
                <stop stopColor="#EA580C" stopOpacity="0.5">
                  <animate attributeName="stop-opacity" values="0.3; 0.6; 0.4; 0.5; 0.3" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="0.5" stopColor="#991B1B" stopOpacity="0.2" />
                <stop offset="1" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              <symbol id="deep_pixelSkull" viewBox="0 0 32 32">
                <g shapeRendering="crispEdges">
                  <rect x="8" y="0" width="16" height="4" fill="#9CA3AF" />
                  <rect x="4" y="4" width="24" height="12" fill="#9CA3AF" />
                  <rect x="8" y="16" width="16" height="8" fill="#9CA3AF" />
                  <rect x="8" y="8" width="4" height="4" fill="#111827" />
                  <rect x="20" y="8" width="4" height="4" fill="#111827" />
                  <rect x="14" y="14" width="4" height="4" fill="#111827" />
                  <rect x="10" y="20" width="2" height="4" fill="#111827" />
                  <rect x="14" y="20" width="2" height="4" fill="#111827" />
                  <rect x="18" y="20" width="2" height="4" fill="#111827" />
                  <rect x="22" y="20" width="2" height="4" fill="#111827" />
                </g>
              </symbol>

              <symbol id="deep_pixelRoots" viewBox="0 0 20 80">
                <g fill="#271C19" shapeRendering="crispEdges">
                  <rect x="0" y="0" width="8" height="60" />
                  <rect x="8" y="20" width="8" height="8" />
                  <rect x="16" y="28" width="4" height="24" />
                  <rect x="-8" y="40" width="8" height="16" />
                  <rect x="-12" y="56" width="4" height="20" />
                </g>
              </symbol>

              <symbol id="deep_magmaCracks" viewBox="0 0 64 64">
                <g shapeRendering="crispEdges">
                  <path d="M0,0 v16 h16 v16 h-8 v16 h24 v12 h16 v-12 h-24 v-16 h8 v-16 z" fill="#7C2D12" />
                  <path d="M4,4 v8 h16 v16 h-8 v8 h8 v-8 h8 v-16 h-16 v-8 z" fill="#F59E0B" />
                </g>
              </symbol>

              <symbol id="deep_pixelTorch" viewBox="-20 -40 40 100">
                <g shapeRendering="crispEdges">
                  <rect x="-16" y="20" width="32" height="36" fill="#374151" stroke="#1A1612" strokeWidth="4" />
                  <rect x="-6" y="10" width="12" height="50" fill="#78350F" stroke="#1A1612" strokeWidth="4" />
                  <rect x="-10" y="16" width="20" height="8" fill="#9CA3AF" stroke="#1A1612" strokeWidth="4" />
                  <rect x="-10" y="36" width="20" height="8" fill="#9CA3AF" stroke="#1A1612" strokeWidth="4" />
                  <g>
                    <animateTransform attributeName="transform" type="scale" values="1 1; 1.05 1.1; 0.95 0.95; 1 1" dur="0.6s" repeatCount="indefinite" additive="sum" />
                    <rect x="-12" y="-12" width="24" height="24" fill="#DC2626" />
                    <rect x="-8" y="-8" width="16" height="20" fill="#EA580C" />
                    <rect x="-4" y="-4" width="8" height="16" fill="#FDE047" />
                  </g>
                </g>
              </symbol>

              <symbol id="deep_pixelTorchAged" viewBox="-20 -40 40 100">
                <g shapeRendering="crispEdges">
                  <rect x="-16" y="20" width="32" height="36" fill="#1F2937" stroke="#0F0A07" strokeWidth="4" />
                  <rect x="-12" y="24" width="8" height="8" fill="#78350F" />
                  <rect x="8" y="44" width="4" height="4" fill="#78350F" />
                  <rect x="-6" y="10" width="12" height="36" fill="#451A03" stroke="#0F0A07" strokeWidth="4" />
                  <rect x="-10" y="16" width="20" height="8" fill="#4B5563" stroke="#0F0A07" strokeWidth="4" />
                  <rect x="-10" y="32" width="20" height="8" fill="#374151" stroke="#0F0A07" strokeWidth="4" />
                  <g>
                    <animateTransform attributeName="transform" type="scale" values="1 1; 0.85 0.8; 1.1 0.9; 0.9 1" dur="1.2s" repeatCount="indefinite" additive="sum" />
                    <rect x="-8" y="-4" width="16" height="16" fill="#991B1B" />
                    <rect x="-4" y="-2" width="8" height="12" fill="#D97706" />
                    <rect x="-2" y="2" width="4" height="8" fill="#FCD34D" />
                  </g>
                </g>
              </symbol>
            </defs>

            <rect width="1600" height="2400" fill="#0A0806" />
            <rect width="1600" height="2400" fill="url(#deep_stoneRow)" />
            <rect width="1600" height="2400" fill="url(#deep_wallGrunge)" />

            {/* Environment Details */}
            <use href="#deep_pixelRoots" x="150" y="600" width="20" height="80" transform="scale(1.5)" />
            <use href="#deep_pixelRoots" x="1400" y="750" width="20" height="80" transform="scale(2)" />
            <use href="#deep_pixelRoots" x="1250" y="650" width="20" height="80" transform="scale(1.2)" />

            <use href="#deep_pixelSkull" x="250" y="1100" width="32" height="32" transform="scale(2)" />
            <use href="#deep_pixelSkull" x="300" y="1450" width="32" height="32" transform="scale(1.5)" />
            <use href="#deep_pixelSkull" x="1350" y="1050" width="32" height="32" transform="scale(2.5)" />
            <use href="#deep_pixelSkull" x="1200" y="1300" width="32" height="32" transform="scale(2)" />

            <use href="#deep_magmaCracks" x="200" y="2100" width="64" height="64" transform="scale(4)" />
            <use href="#deep_magmaCracks" x="1200" y="1950" width="64" height="64" transform="scale(3) scale(-1, 1)" />
            <use href="#deep_magmaCracks" x="850" y="2250" width="64" height="64" transform="scale(5)" />

            <rect width="1600" height="2400" fill="url(#deep_depthShadow)" pointerEvents="none" />

            {/* Main Torches (Top) */}
            <rect x="20" y="10" width="400" height="400" fill="url(#deep_torchGlow)" pointerEvents="none" />
            <use href="#deep_pixelTorch" x="220" y="210" width="40" height="100" />
            <rect x="1180" y="10" width="400" height="400" fill="url(#deep_torchGlow)" pointerEvents="none" />
            <use href="#deep_pixelTorch" x="1380" y="210" width="40" height="100" />

            {/* Aged Torches (Middle) */}
            <rect x="0" y="650" width="300" height="300" fill="url(#deep_agedTorchGlow)" pointerEvents="none" />
            <use href="#deep_pixelTorchAged" x="150" y="800" width="40" height="100" />

            <rect x="1250" y="850" width="300" height="300" fill="url(#deep_agedTorchGlow)" pointerEvents="none" />
            <use href="#deep_pixelTorchAged" x="1400" y="1000" width="40" height="100" />

            {/* Magma (Bottom) */}
            <rect x="0" y="1600" width="1600" height="800" fill="url(#deep_magmaGlow)" pointerEvents="none" />

            {/* Magma Bubbles */}
            <g fill="#FDE047">
              <circle cx="300" cy="2300" r="3"><animate attributeName="cy" values="2300; 1900" dur="4s" repeatCount="indefinite" /><animate attributeName="opacity" values="1; 0" dur="4s" repeatCount="indefinite" /></circle>
              <circle cx="800" cy="2350" r="4"><animate attributeName="cy" values="2350; 1800" dur="5s" repeatCount="indefinite" /><animate attributeName="opacity" values="1; 0" dur="5s" repeatCount="indefinite" /></circle>
              <circle cx="1300" cy="2250" r="2"><animate attributeName="cy" values="2250; 2000" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values="1; 0" dur="3s" repeatCount="indefinite" /></circle>
            </g>
          </svg>
        </div>
      ) : (
        /* ═══ THEME: CAVE (FALLBACK) ═══ */
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
            <radialGradient id="cave_centerGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(800 270) rotate(90) scale(260 700)">
              <stop stopColor="#422416" />
              <stop offset="1" stopColor="#422416" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cave_torchGlowL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 210) rotate(90) scale(220 260)">
              <stop stopColor="#C25317" stopOpacity="0.35">
                <animate attributeName="stop-opacity" values="0.3; 0.45; 0.25; 0.4; 0.3" dur="1.8s" repeatCount="indefinite" />
              </stop>
              <stop offset="1" stopColor="#C25317" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cave_torchGlowR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1380 210) rotate(90) scale(220 260)">
              <stop stopColor="#C25317" stopOpacity="0.35">
                <animate attributeName="stop-opacity" values="0.4; 0.25; 0.45; 0.3; 0.4" dur="2.1s" repeatCount="indefinite" />
              </stop>
              <stop offset="1" stopColor="#C25317" stopOpacity="0" />
            </radialGradient>
            <symbol id="cave_pixelTorch" viewBox="-20 -40 40 100">
              <rect x="-16" y="20" width="32" height="36" fill="#374151" stroke="#1A1612" strokeWidth="4" />
              <rect x="-10" y="26" width="4" height="4" fill="#9CA3AF" />
              <rect x="6" y="26" width="4" height="4" fill="#9CA3AF" />
              <rect x="-10" y="44" width="4" height="4" fill="#9CA3AF" />
              <rect x="6" y="44" width="4" height="4" fill="#9CA3AF" />
              <rect x="-6" y="10" width="12" height="50" fill="#78350F" stroke="#1A1612" strokeWidth="4" />
              <rect x="-2" y="10" width="4" height="50" fill="#92400E" />
              <rect x="-10" y="16" width="20" height="8" fill="#9CA3AF" stroke="#1A1612" strokeWidth="4" />
              <rect x="-10" y="36" width="20" height="8" fill="#9CA3AF" stroke="#1A1612" strokeWidth="4" />
              <g>
                <animateTransform attributeName="transform" type="scale" values="1 1; 1.05 1.1; 0.95 0.95; 1 1" dur="0.6s" repeatCount="indefinite" additive="sum" />
                <rect x="-12" y="-12" width="24" height="24" fill="#DC2626" />
                <rect x="-8" y="-20" width="16" height="8" fill="#DC2626" />
                <rect x="-4" y="-28" width="8" height="8" fill="#DC2626" />
                <rect x="-8" y="-8" width="16" height="20" fill="#EA580C" />
                <rect x="-4" y="-16" width="8" height="8" fill="#EA580C" />
                <rect x="-4" y="-4" width="8" height="16" fill="#FDE047" />
                <rect x="-2" y="-10" width="4" height="6" fill="#FDE047" />
              </g>
            </symbol>
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
          <g>
            <rect width="1600" height="900" fill="url(#cave_centerGlow)" opacity="0.8" />
            <rect width="1600" height="900" fill="url(#cave_torchGlowL)" />
            <rect width="1600" height="900" fill="url(#cave_torchGlowR)" />
          </g>
          <use href="#cave_pixelTorch" x="220" y="210" width="40" height="100" />
          <use href="#cave_pixelTorch" x="1380" y="210" width="40" height="100" />
          <rect x="0" y="620" width="1600" height="280" fill="url(#cave_floor)" />
          <rect x="0" y="620" width="1600" height="280" fill="url(#cave_floorTile)" opacity="0.55" />
          <rect width="1600" height="900" fill="black" opacity="0.18" style={{ pointerEvents: 'none' }} />
        </svg>
      )}

      {/* Shared Particles */}
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
