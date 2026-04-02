import React from "react";
import { cn } from "@/lib/utils";

interface ExpBarProps {
  level: number;
  totalExp: number;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const expCaps = [200, 500, 900, 1500, 2300, 3500, 5000, 6500, 7500, 8000, 8500];
const MAX_LEVEL = 10;

const ExpBar: React.FC<ExpBarProps> = ({ 
  level, 
  totalExp, 
  className, 
  showText = false,
  size = "md" 
}) => {
  const isMaxLevel = level >= MAX_LEVEL;
  
  // milstones: [200, 500, 900, 1500, ...]
  // Level 1: 0 - 200
  // Level 2: 200 - 500
  // Level 3: 500 - 900
  const minExp = level > 1 ? expCaps[Math.min(level - 2, expCaps.length - 1)] : 0;
  const maxExp = isMaxLevel ? expCaps[expCaps.length - 1] : expCaps[Math.min(level - 1, expCaps.length - 1)];
  
  const currentLevelExp = totalExp - minExp;
  const neededExp = maxExp - minExp;
  
  // Clamp progress between 0 and 100
  const progress = isMaxLevel ? 100 : Math.min(Math.max((currentLevelExp / neededExp) * 100, 0), 100);

  const heightMap = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6"
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div 
        className={cn(
          "relative w-full bg-[#0f172a] border border-[#334155] p-[1px]",
          heightMap[size]
        )}
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Progress Fill */}
        <div 
          className="h-full bg-[#10b981] transition-all duration-700 ease-in-out relative border-r border-[#064e3b]"
          style={{ width: `${progress}%` }}
        >
          {/* Shine/Highlights */}
          <div className="absolute top-0 left-0 w-full h-[40%] bg-white/10" />
          <div className="absolute bottom-0 left-0 w-full h-[20%] bg-black/10" />
        </div>
      </div>
      
      {showText && (
        <div className="flex justify-between items-center px-0.5">
           <span className="font-pixel text-[8px] text-[#64748b] uppercase tracking-tighter">
            Next LVL
          </span>
          <span className="font-pixel text-[9px] text-[#10b981] leading-none">
            {isMaxLevel ? "MAX" : `${totalExp}/${maxExp}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ExpBar;
