import React from 'react';

// สร้าง Component ชื่อ PixelSword
const PixelSword = ({ size = 24, bladeColor = "#EAEAEA", hiltColor = "#8B4513", guardColor = "#CD7F32" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }} // สำคัญ: บังคับให้ขอบคมชัดแบบพิกเซล
    >
      {/* ใบดาบ (Blade) */}
      <rect x="7" y="1" width="2" height="2" fill={bladeColor} />
      <rect x="7" y="3" width="2" height="2" fill={bladeColor} />
      <rect x="7" y="5" width="2" height="2" fill={bladeColor} />
      <rect x="7" y="7" width="2" height="2" fill={bladeColor} />
      <rect x="7" y="9" width="2" height="2" fill={bladeColor} />

      {/* โกร่งดาบ (Guard) */}
      <rect x="5" y="10" width="2" height="2" fill={guardColor} />
      <rect x="7" y="10" width="2" height="2" fill={guardColor} />
      <rect x="9" y="10" width="2" height="2" fill={guardColor} />

      {/* ด้ามจับ (Hilt) */}
      <rect x="7" y="12" width="2" height="2" fill={hiltColor} />
      <rect x="7" y="14" width="2" height="2" fill={hiltColor} />
    </svg>
  );
};

export default PixelSword;