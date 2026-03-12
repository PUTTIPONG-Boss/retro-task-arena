import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "font-pixel uppercase tracking-wider transition-none select-none cursor-pointer pixel-text-shadow border-[3px] border-[hsl(var(--pixel-shadow))]";

    const variants = {
      primary:
        "bg-primary text-primary-foreground shadow-[inset_-3px_-3px_0_0_hsl(220_60%_40%),inset_3px_3px_0_0_hsl(220_70%_70%)] active:shadow-[inset_3px_3px_0_0_hsl(220_60%_40%)] active:translate-x-[2px] active:translate-y-[2px]",
      gold: "bg-accent text-accent-foreground shadow-[inset_-3px_-3px_0_0_hsl(45_70%_40%),inset_3px_3px_0_0_hsl(45_90%_75%)] active:shadow-[inset_3px_3px_0_0_hsl(45_70%_40%)] active:translate-x-[2px] active:translate-y-[2px]",
      danger:
        "bg-destructive text-destructive-foreground shadow-[inset_-3px_-3px_0_0_hsl(0_60%_35%),inset_3px_3px_0_0_hsl(0_70%_65%)] active:shadow-[inset_3px_3px_0_0_hsl(0_60%_35%)] active:translate-x-[2px] active:translate-y-[2px]",
      ghost:
        "bg-transparent text-foreground border-muted shadow-none hover:bg-muted active:translate-x-[2px] active:translate-y-[2px]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[8px]",
      md: "px-5 py-2.5 text-[10px]",
      lg: "px-8 py-3.5 text-[12px]",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";
export default PixelButton;
