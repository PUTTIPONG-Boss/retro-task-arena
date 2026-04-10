import React from 'react';

interface PixelInboxProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelInbox: React.FC<PixelInboxProps> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Arrow stem */}
    <rect x="11" y="2"  width="2" height="6" />

    {/* Arrowhead - wide row */}
    <rect x="7"  y="8"  width="10" height="2" />
    {/* Arrowhead - middle row */}
    <rect x="9"  y="10" width="6"  height="2" />
    {/* Arrowhead - tip */}
    <rect x="11" y="12" width="2"  height="2" />

    {/* Tray left wall */}
    <rect x="2"  y="14" width="2"  height="6" />
    {/* Tray right wall */}
    <rect x="20" y="14" width="2"  height="6" />
    {/* Tray bottom */}
    <rect x="2"  y="20" width="20" height="2" />
    {/* Tray top-left ledge */}
    <rect x="4"  y="14" width="4"  height="2" />
    {/* Tray top-right ledge */}
    <rect x="16" y="14" width="4"  height="2" />
  </svg>
);

export default PixelInbox;
