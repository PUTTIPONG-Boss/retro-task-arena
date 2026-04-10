import React from 'react';

interface PixelCheckProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelCheck: React.FC<PixelCheckProps> = ({ size = 24, color = "currentColor", className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      viewBox="0 0 24 24"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Pixel 8-bit checkmark */}
      <rect x="2"  y="12" width="2" height="2" />
      <rect x="4"  y="14" width="2" height="2" />
      <rect x="6"  y="16" width="2" height="2" />
      <rect x="8"  y="14" width="2" height="2" />
      <rect x="10" y="12" width="2" height="2" />
      <rect x="12" y="10" width="2" height="2" />
      <rect x="14" y="8"  width="2" height="2" />
      <rect x="16" y="6"  width="2" height="2" />
      <rect x="18" y="4"  width="2" height="2" />
      <rect x="20" y="2"  width="2" height="2" />
    </svg>
  );
};

export default PixelCheck;
