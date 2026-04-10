import React from 'react';

interface PixelUsersProps {
  size?: number;
  color?: string;
  className?: string;
}

const PixelUsers: React.FC<PixelUsersProps> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Left person - head */}
    <rect x="2" y="2" width="2" height="2" />
    <rect x="4" y="2" width="2" height="2" />
    <rect x="2" y="4" width="2" height="2" />
    <rect x="4" y="4" width="2" height="2" />
    {/* Left person - body */}
    <rect x="0" y="8" width="2" height="2" />
    <rect x="2" y="6" width="2" height="2" />
    <rect x="4" y="6" width="2" height="2" />
    <rect x="6" y="8" width="2" height="2" />
    <rect x="0" y="10" width="2" height="2" />
    <rect x="2" y="10" width="2" height="2" />
    <rect x="4" y="10" width="2" height="2" />
    <rect x="6" y="10" width="2" height="2" />
    {/* Left person - legs */}
    <rect x="2" y="12" width="2" height="2" />
    <rect x="4" y="12" width="2" height="2" />
    <rect x="0" y="14" width="2" height="2" />
    <rect x="6" y="14" width="2" height="2" />

    {/* Right person - head */}
    <rect x="16" y="2" width="2" height="2" />
    <rect x="18" y="2" width="2" height="2" />
    <rect x="16" y="4" width="2" height="2" />
    <rect x="18" y="4" width="2" height="2" />
    {/* Right person - body */}
    <rect x="14" y="8" width="2" height="2" />
    <rect x="16" y="6" width="2" height="2" />
    <rect x="18" y="6" width="2" height="2" />
    <rect x="20" y="8" width="2" height="2" />
    <rect x="14" y="10" width="2" height="2" />
    <rect x="16" y="10" width="2" height="2" />
    <rect x="18" y="10" width="2" height="2" />
    <rect x="20" y="10" width="2" height="2" />
    {/* Right person - legs */}
    <rect x="16" y="12" width="2" height="2" />
    <rect x="18" y="12" width="2" height="2" />
    <rect x="14" y="14" width="2" height="2" />
    <rect x="20" y="14" width="2" height="2" />

    {/* Middle overlap / shared area hint */}
    <rect x="8" y="8" width="2" height="2" />
    <rect x="10" y="6" width="2" height="2" />
    <rect x="12" y="8" width="2" height="2" />
    <rect x="8" y="10" width="2" height="2" />
    <rect x="10" y="10" width="2" height="2" />
    <rect x="12" y="10" width="2" height="2" />
    <rect x="10" y="4" width="2" height="2" />
    <rect x="10" y="2" width="2" height="2" />
  </svg>
);

export default PixelUsers;
