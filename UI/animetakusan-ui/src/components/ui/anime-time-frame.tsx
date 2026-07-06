import { cn } from "@/lib/utils";
import type { Anime } from "@/models/common/Anime";
import { displaySeason } from "@/models/common/AnimeSeason";
import { formatDistanceToNowStrict } from "date-fns";
import { useMemo } from "react";

const AnimeTimeFrame = ( { anime, className }: { anime: Anime, className?: string } ) => {

  const timeFrame = useMemo(() => {
    // Next airing episode
    if (anime.nextAiringEpisode) {
      const airsAt = new Date(anime.nextAiringEpisode.airingAt * 1000);
      return `Ep. ${anime.nextAiringEpisode.episode} ${formatDistanceToNowStrict(airsAt, { addSuffix: true })}`;
    }

    // Season and year
    if (anime.season && anime.seasonYear) {
      return `${displaySeason(anime.season)} ${anime.seasonYear}`;
    }

    // Date range for multi-year anime
    if (anime.startDate?.year && anime.endDate?.year) {
      const yearDiff = anime.endDate.year - anime.startDate.year;
      if (yearDiff > 1) {
        return `${anime.startDate.year} - ${anime.endDate.year}`;
      }
    }

    return "TBA";
  }, [anime.nextAiringEpisode, anime.season, anime.seasonYear, anime.startDate, anime.endDate]);

  return <div className={cn("font-semibold text-sm text-muted-foreground", className)}>{timeFrame}</div>;
}
export default AnimeTimeFrame;