import { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";
import { Coins } from "lucide-react";

const PointsAnimation = () => {
  const { pointsAnimation, clearPointsAnimation } = useUiStore();

  useEffect(() => {
    if (pointsAnimation.show) {
      const timer = setTimeout(clearPointsAnimation, 2500);
      return () => clearTimeout(timer);
    }
  }, [pointsAnimation.show, clearPointsAnimation]);

  if (!pointsAnimation.show) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center">
      {/* Coin particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-coin-rain"
          style={{
            left: `${30 + Math.random() * 40}%`,
            animationDelay: `${i * 0.15}s`,
          }}
        >
          <Coins className="w-8 h-8 text-yellow-400" />
        </span>
      ))}
      {/* Points text */}
      <div className="animate-points-pop">
        <span className="font-pixel text-[28px] text-accent pixel-text-shadow terminal-glow">
          +{pointsAnimation.amount} GP
        </span>
      </div>
    </div>
  );
};

export default PointsAnimation;
