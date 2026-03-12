interface DifficultyStarsProps {
  level: number;
  max?: number;
}

const DifficultyStars = ({ level, max = 5 }: DifficultyStarsProps) => {
  return (
    <span className="inline-flex gap-0.5 font-pixel text-[10px]">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < level ? "text-accent" : "text-muted-foreground opacity-40"}>
          {i < level ? "⚔" : "⚔"}
        </span>
      ))}
    </span>
  );
};

export default DifficultyStars;
