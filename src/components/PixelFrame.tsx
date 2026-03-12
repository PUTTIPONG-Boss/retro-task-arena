import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PixelFrameProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "parchment" | "dark";
}

const PixelFrame = ({ children, className, variant = "default" }: PixelFrameProps) => {
  const variants = {
    default: "bg-card pixel-border",
    parchment: "parchment pixel-border",
    dark: "bg-background pixel-border",
  };

  return (
    <div className={cn("p-4", variants[variant], className)}>
      {children}
    </div>
  );
};

export default PixelFrame;
