import React from 'react';

interface PixelFlagProps {
  size?: number | string;
  color?: string;
  flagColor?: string;
  className?: string;
}

const PixelFlag: React.FC<PixelFlagProps> = ({
  size = 24,
  color = 'currentColor',
  flagColor = '#ef4444',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Pole (vertical staff) */}
    <rect x="2" y="1" width="2" height="14" fill={color} />

    {/* Flag triangle pointing right */}
    {/* Row 1 — widest */}
    <rect x="4" y="1" width="10" height="2" fill={flagColor} />
    {/* Row 2 */}
    <rect x="4" y="3" width="8"  height="2" fill={flagColor} />
    {/* Row 3 */}
    <rect x="4" y="5" width="6"  height="2" fill={flagColor} />
    {/* Row 4 */}
    <rect x="4" y="7" width="4"  height="2" fill={flagColor} />
    {/* Row 5 — tip */}
    <rect x="4" y="9" width="2"  height="2" fill={flagColor} />
  </svg>
);

export default PixelFlag;
