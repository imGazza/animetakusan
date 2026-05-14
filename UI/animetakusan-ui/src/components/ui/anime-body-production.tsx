import { calculateDurationFromMinutes, createDateFromDetails, formatDuration } from "@/lib/utils";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { format } from "date-fns";
import AnimeGenres from "./anime-card-genres";
import { useMemo } from "react";
import { displaySource } from "@/models/common/AnimeSource";
import { displaySeason } from "@/models/common/AnimeSeason";

const AnimeBodyProduction = ({ anime }: { anime: AnimeDetail }) => {

  const formattedDuration = useMemo(() => {
    if (anime.duration) {
      const { hours, minutes } = calculateDurationFromMinutes(anime.duration);
      const timeRemaining = formatDuration(hours, minutes);
      return timeRemaining;
    }
    return null;
  }, [anime.duration]);

  return (
    <>
      <div className="block md:flex md:flex-col md:gap-4 rounded-xs overflow-hidden animate-in fade-in duration-300">
        <div className="border bg-muted p-4 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground/50 text-xs tracking-wider">
                {`Studio ${anime.studios.nodes.length > 1 ? "s" : ""}`}
              </div>
              <div className="text-md font-semibold leading-none text-primary/90">
                {anime.studios.nodes.length > 0 ? anime.studios.nodes.map((studio) => studio.name).join(", ") : "TBA"}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground/50 text-xs tracking-wider">
                Season
              </div>
              <div className="text-md font-semibold leading-none text-primary/90">
                {anime.season && anime.seasonYear ? `${displaySeason(anime.season)} ${anime.seasonYear}` : "TBA"}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground/50 text-xs tracking-wider">
                Start Date
              </div>
              <div className="text-md font-semibold leading-none text-primary/90">
                {anime.startDate ? format(createDateFromDetails(anime.startDate), "PPP") : "TBA"}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground/50 text-xs tracking-wider">
                End Date
              </div>
              <div className="text-md font-semibold leading-none text-primary/90">
                {anime.endDate ? format(createDateFromDetails(anime.endDate), "PPP") : "TBA"}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground/50 text-xs tracking-wider">
                {anime.episodes && anime.episodes > 1 ? `Episode Duration` : `Duration`}
              </div>
              <div className="text-md font-semibold leading-none text-primary/90">
                {formattedDuration ?? "TBA"}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-muted-foreground/50 text-xs tracking-wider">
                Source
              </div>
              <div className="text-md font-semibold leading-none text-primary/90">
                {anime.source ? displaySource(anime.source) : "Unknown"}
              </div>
            </div>
          </div>
          {
            anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-4 md:hidden">
                <div className="text-muted-foreground/50 uppercase text-xs tracking-wider">
                  Genres
                </div>
                <div className="text-md font-semibold leading-none text-primary/90">
                  <AnimeGenres genres={anime.genres} />
                </div>
              </div>
            )
          }
        </div>
        {
          anime.genres && anime.genres.length > 0 && (
            <div className="flex-col gap-1.5 hidden md:flex p-4 bg-muted border">
              <div className="text-muted-foreground/50 uppercase text-xs tracking-wider">
                Genres
              </div>
              <div className="text-md font-semibold leading-none">
                <AnimeGenres genres={anime.genres} />
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}
export default AnimeBodyProduction;