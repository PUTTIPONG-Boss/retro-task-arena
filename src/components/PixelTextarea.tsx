import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

const PixelTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full bg-background text-foreground font-pixel-body text-lg px-3 py-2 pixel-inset focus:border-primary outline-none placeholder:text-muted-foreground resize-none",
        className
      )}
      {...props}
    />
  )
);

PixelTextarea.displayName = "PixelTextarea";
export default PixelTextarea;
