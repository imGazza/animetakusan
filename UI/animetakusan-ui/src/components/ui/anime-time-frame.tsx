import { calculateDurationFromSeconds } from "@/lib/utils";
import type { Anime } from "@/models/common/Anime";
import { useMemo } from "react";

const formatTimeRemaining = (days: number, hours: number, minutes: number): string => {
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

const AnimeTimeFrame = ( { anime }: { anime: Anime } ) => {

  const timeFrame = useMemo(() => {
    // Next airing episode
    if (anime.nextAiringEpisode) {
      const { days, hours, minutes } = calculateDurationFromSeconds(anime.nextAiringEpisode.timeUntilAiring);
      const timeRemaining = formatTimeRemaining(days, hours, minutes);
      return `Ep ${anime.nextAiringEpisode.episode} in ${timeRemaining}`;
    }

    // Season and year
    if (anime.season && anime.seasonYear) {
      return `${anime.season.toLowerCase()} ${anime.seasonYear}`;
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

  return <div className="capitalize font-semibold">{timeFrame}</div>;
}
export default AnimeTimeFrame;