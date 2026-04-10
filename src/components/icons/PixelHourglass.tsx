import React from 'react';

interface PixelHourglassProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelHourglass: React.FC<PixelHourglassProps> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Top cap */}
    <rect x="4"  y="2"  width="16" height="2" />
    {/* Top sand - wide */}
    <rect x="4"  y="4"  width="4"  height="2" />
    <rect x="16" y="4"  width="4"  height="2" />
    <rect x="6"  y="4"  width="12" height="2" />
    {/* Narrowing */}
    <rect x="6"  y="6"  width="4"  height="2" />
    <rect x="14" y="6"  width="4"  height="2" />
    <rect x="8"  y="8"  width="4"  height="2" />
    <rect x="12" y="8"  width="4"  height="2" />
    {/* Pinch midpoint */}
    <rect x="10" y="10" width="4"  height="2" />
    {/* Bottom half expanding */}
    <rect x="8"  y="12" width="4"  height="2" />
    <rect x="12" y="12" width="4"  height="2" />
    <rect x="6"  y="14" width="4"  height="2" />
    <rect x="14" y="14" width="4"  height="2" />
    {/* Bottom sand - accumulating */}
    <rect x="6"  y="16" width="12" height="2" />
    <rect x="4"  y="18" width="4"  height="2" />
    <rect x="16" y="18" width="4"  height="2" />
    <rect x="6"  y="18" width="12" height="2" />
    {/* Bottom cap */}
    <rect x="4"  y="20" width="16" height="2" />
  </svg>
);

export default PixelHourglass;
