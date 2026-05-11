import { cn } from "@/lib/utils";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { displaySeason } from "@/models/common/AnimeSeason";
import { Trophy } from "lucide-react";

type RankTier = {
  border: string;
  accent: string;
  bg: string;
  iconBg: string;
  icon: string;
  rank: string;
  label: string;
};

function getRankTier(rank: number): RankTier {
  if (rank <= 10) return {
    border: "border-amber-400/40",
    accent: "border-l-amber-400",
    bg: "from-amber-400/15 via-amber-400/5 to-transparent",
    iconBg: "bg-amber-400/20",
    icon: "text-amber-400",
    rank: "text-amber-400",
    label: "text-amber-500 dark:text-amber-300",
  };
  if (rank <= 50) return {
    border: "border-emerald-500/30",
    accent: "border-l-emerald-500",
    bg: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15",
    icon: "text-emerald-500",
    rank: "text-emerald-500",
    label: "text-emerald-600 dark:text-emerald-400",
  };
  if (rank <= 100) return {
    border: "border-sky-500/30",
    accent: "border-l-sky-500",
    bg: "from-sky-500/10 via-sky-500/5 to-transparent",
    iconBg: "bg-sky-500/15",
    icon: "text-sky-500",
    rank: "text-sky-500",
    label: "text-sky-600 dark:text-sky-400",
  };
  if (rank <= 200) return {
    border: "border-violet-500/30",
    accent: "border-l-violet-500",
    bg: "from-violet-500/10 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/15",
    icon: "text-violet-500",
    rank: "text-violet-500",
    label: "text-violet-600 dark:text-violet-400",
  };
  return {
    border: "border-muted-foreground/20",
    accent: "border-l-muted-foreground/40",
    bg: "from-muted-foreground/10 via-muted-foreground/5 to-transparent",
    iconBg: "bg-muted-foreground/10",
    icon: "text-muted-foreground",
    rank: "text-muted-foreground",
    label: "text-muted-foreground",
  };
}

const AnimeBodyRankings = ({ anime }: { anime: AnimeDetail }) => {

  if (anime.rankings.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 p-4 bg-muted border rounded-xs">
      <div className="text-muted-foreground/50 uppercase text-xs tracking-wider">
        Rankings
      </div>
      <div className="flex flex-wrap gap-2">
        {anime.rankings.map((ranking, index) => {
          const tier = getRankTier(ranking.rank);
          return (
            <div key={index} className={cn("flex-1 min-w-[160px] inline-flex items-center gap-3 rounded-xl border-l-2 border", tier.accent, tier.border, "bg-gradient-to-r", tier.bg, "px-2 py-2")}>
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", tier.iconBg)}>
                <Trophy className={cn("size-4", tier.icon)} />
              </div>

              <div className="flex flex-col gap-0">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("text-lg font-bold tabular-nums", tier.rank)}>
                    #{ranking.rank}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {ranking.type}
                  </span>
                </div>

                <span className={cn("text-xs font-medium", tier.label)}>
                  {ranking.allTime
                  ? "All Time"
                  : [displaySeason(ranking.season), ranking.year].filter(Boolean).join(" ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimeBodyRankings;

