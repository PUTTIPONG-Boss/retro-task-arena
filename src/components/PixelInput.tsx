import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const PixelInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-background text-foreground font-pixel-body text-lg px-3 py-2 pixel-inset focus:border-primary outline-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);

PixelInput.displayName = "PixelInput";
export default PixelInput;
