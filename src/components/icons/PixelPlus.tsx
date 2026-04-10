import React from "react";

interface PixelPlusProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelPlus: React.FC<PixelPlusProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: "pixelated" }}
  >
    {/* แนวนอน (Horizontal bar) */}
    <rect x="2"  y="10" width="4" height="4" />
    <rect x="6"  y="10" width="4" height="4" />
    <rect x="10" y="10" width="4" height="4" />
    <rect x="14" y="10" width="4" height="4" />
    <rect x="18" y="10" width="4" height="4" />
    {/* แนวตั้ง (Vertical bar) */}
    <rect x="10" y="2"  width="4" height="4" />
    <rect x="10" y="6"  width="4" height="4" />
    <rect x="10" y="14" width="4" height="4" />
    <rect x="10" y="18" width="4" height="4" />
  </svg>
);

export default PixelPlus;
