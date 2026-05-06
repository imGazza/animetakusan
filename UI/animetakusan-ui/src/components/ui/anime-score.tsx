import { cn, getGlowColor, getRingColor } from "@/lib/utils";

const AnimeScore = ({ score, className }: { score: number | null, className?: string }) => {

  const ring = getRingColor(score || 0);
  const glow = getGlowColor(score || 0);

  if(!score)
    return null;

  return (
    <div className={cn("font-bold leading-none ring-2 shadow-md rounded-full size-[2em] flex shrink-0 items-center justify-center tabular-nums select-none", ring, glow, className)}>
      {score ? `${score}` : "NA"}
    </div>
  )
}
export default AnimeScore;