import React from 'react';

interface PixelScrollProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelScroll: React.FC<PixelScrollProps> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Top scroll curl */}
    <rect x="2"  y="2"  width="2"  height="2" />
    <rect x="4"  y="0"  width="4"  height="2" />
    <rect x="8"  y="2"  width="12" height="2" />
    <rect x="20" y="4"  width="2"  height="2" />

    {/* Scroll body left edge (curl) */}
    <rect x="0"  y="4"  width="2"  height="2" />
    <rect x="2"  y="4"  width="2"  height="14" />

    {/* Scroll body right edge */}
    <rect x="20" y="6"  width="2"  height="12" />

    {/* Text lines inside */}
    <rect x="6"  y="6"  width="12" height="2" />
    <rect x="6"  y="10" width="10" height="2" />
    <rect x="6"  y="14" width="12" height="2" />

    {/* Bottom scroll curl */}
    <rect x="0"  y="18" width="2"  height="2" />
    <rect x="2"  y="18" width="2"  height="2" />
    <rect x="4"  y="20" width="4"  height="2" />
    <rect x="8"  y="22" width="12" height="2" />
    <rect x="20" y="18" width="2"  height="2" />
    <rect x="4"  y="22" width="2"  height="2" />
  </svg>
);

export default PixelScroll;
