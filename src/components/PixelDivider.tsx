interface PixelDividerProps {
  label?: string;
  className?: string;
}

const PixelDivider = ({ label, className = "" }: PixelDividerProps) => {
  if (label) {
    return (
      <div className={`flex items-center gap-3 my-4 ${className}`}>
        <div className="flex-1 h-[2px] bg-border" style={{ backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 8px)' }} />
        <span className="font-pixel text-[8px] text-muted-foreground tracking-widest uppercase">{label}</span>
        <div className="flex-1 h-[2px]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 8px)' }} />
      </div>
    );
  }

  return (
    <div
      className={`h-[2px] my-4 ${className}`}
      style={{ backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 8px)' }}
    />
  );
};

export default PixelDivider;
