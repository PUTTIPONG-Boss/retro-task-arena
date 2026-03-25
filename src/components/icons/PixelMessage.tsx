import React from 'react';

interface PixelMessageProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const PixelMessage: React.FC<PixelMessageProps> = ({ size = 24, color = "currentColor", className = "" }) => {
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
      <path d="M22 22h-2v-2h-2v-2h2V4h2v18Zm-4-4H4v-2h14v2ZM4 16H2V4h2v12Zm8-4H6v-2h6v2Zm6-4H6V6h12v2Zm2-4H4V2h16v2Z"/>
    </svg>
  );
};

export default PixelMessage;
