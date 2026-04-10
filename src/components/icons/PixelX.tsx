import React from 'react';

interface PixelXProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelX: React.FC<PixelXProps> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Top-left to bottom-right diagonal */}
    <rect x="2"  y="2"  width="4" height="4" />
    <rect x="6"  y="6"  width="4" height="4" />
    <rect x="10" y="10" width="4" height="4" />
    <rect x="14" y="14" width="4" height="4" />
    <rect x="18" y="18" width="4" height="4" />
    {/* Top-right to bottom-left diagonal */}
    <rect x="18" y="2"  width="4" height="4" />
    <rect x="14" y="6"  width="4" height="4" />
    <rect x="6"  y="14" width="4" height="4" />
    <rect x="2"  y="18" width="4" height="4" />
  </svg>
);

export default PixelX;
