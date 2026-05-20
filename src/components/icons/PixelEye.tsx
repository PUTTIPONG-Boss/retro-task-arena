import React from 'react';

const PixelEye = ({ size = 24, className = "", color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    fill={color} 
    viewBox="0 0 24 24"
  >
    <path d="M8 8h8v2H8V8z M6 10h2v2H6v-2z M16 10h2v2h-2v-2z M4 12h2v2H4v-2z M18 12h2v2h-2v-2z M6 14h2v2H6v-2z M16 14h2v2h-2v-2z M8 16h8v2H8v-2z M10 11h4v2h-4v-2z" />
  </svg>
);

export default PixelEye;
