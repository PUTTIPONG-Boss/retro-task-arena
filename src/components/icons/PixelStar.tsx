import React from 'react';

interface PixelStarProps {
  size?: number;
  color?: string;
  className?: string;
}

const PixelStar = ({ size = 24, color = "#FFD700", className = "" }: PixelStarProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 8-bit Star Shape */}
      {/* Top Peak */}
      <rect x="7" y="1" width="2" height="2" fill={color} />
      <rect x="6" y="3" width="4" height="2" fill={color} />
      
      {/* Middle Bar */}
      <rect x="1" y="5" width="14" height="2" fill={color} />
      <rect x="3" y="7" width="10" height="2" fill={color} />
      
      {/* Bottom Core */}
      <rect x="4" y="9" width="8" height="2" fill={color} />
      
      {/* Legs */}
      <rect x="2" y="11" width="3" height="2" fill={color} />
      <rect x="11" y="11" width="3" height="2" fill={color} />
      <rect x="1" y="13" width="2" height="2" fill={color} />
      <rect x="13" y="13" width="2" height="2" fill={color} />
    </svg>
  );
};

export default PixelStar;
