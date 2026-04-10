import React from 'react';

interface PixelRecycleProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelRecycle: React.FC<PixelRecycleProps> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* U-turn arc — top curve */}
    <rect x="6"  y="4"  width="8" height="2" />
    <rect x="4"  y="6"  width="2" height="2" />
    <rect x="14" y="6"  width="2" height="2" />
    <rect x="4"  y="8"  width="2" height="2" />
    <rect x="14" y="8"  width="2" height="2" />
    <rect x="4"  y="10" width="2" height="2" />
    <rect x="14" y="10" width="2" height="2" />
    <rect x="4"  y="12" width="2" height="2" />
    <rect x="14" y="12" width="2" height="2" />
    <rect x="4"  y="14" width="2" height="2" />
    <rect x="14" y="14" width="2" height="2" />

    {/* U-turn bottom — left leg extends down */}
    <rect x="4"  y="16" width="2" height="2" />
    <rect x="4"  y="18" width="2" height="2" />

    {/* Arrowhead — pointing down on right leg */}
    <rect x="12" y="16" width="2" height="2" />
    <rect x="16" y="16" width="2" height="2" />
    <rect x="12" y="18" width="2" height="2" />
    <rect x="16" y="18" width="2" height="2" />
    <rect x="10" y="18" width="2" height="2" />
    <rect x="18" y="18" width="2" height="2" />
    <rect x="14" y="20" width="2" height="2" />
  </svg>
);

export default PixelRecycle;
