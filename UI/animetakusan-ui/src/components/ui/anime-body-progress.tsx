import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Play, Tv } from "lucide-react";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { cn, createDateFromDetails } from "@/lib/utils";
import { Button } from "./button";
import { format, formatDistanceToNowStrict } from "date-fns";
import type { DetailedDate } from "@/models/common/Anime";
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus";
import { useAnimeProgress } from "@/hooks/useAnimeProgress";

const statusClasses: Record<string, { gradient: string; bg: string; bgMuted: string; text: string }> = {
  "CURRENT": { gradient: "bg-gradient-to-r from-blue-400 to-cyan-600", bg: "bg-blue-400/10", bgMuted: "bg-blue-500/30", text: "text-blue-500" },
  "PLANNING": { gradient: "bg-gradient-to-r from-yellow-500 to-orange-400", bg: "bg-yellow-500/10", bgMuted: "bg-yellow-500/30", text: "text-yellow-500" },
  "COMPLETED": { gradient: "bg-gradient-to-r from-violet-400 to-purple-500", bg: "bg-violet-500/10", bgMuted: "bg-violet-500/30", text: "text-violet-400" },
  "DROPPED": { gradient: "bg-gradient-to-r from-red-400 to-rose-600", bg: "bg-red-500/10", bgMuted: "bg-red-500/30", text: "text-red-500" },
};
const defaultClasses = { gradient: "bg-gradient-to-r from-gray-400 to-gray-600", bg: "bg-gray-500/10", bgMuted: "bg-gray-500/30", text: "text-gray-500" };

const getProgressLabel = (animeStatus: string, entryStatus: string, entryEpisodeProgress: number, nextAiringAtUnix?: number, nextEpisode?: number): string => {

  if (animeStatus === "RELEASING" && nextAiringAtUnix && nextEpisode && entryEpisodeProgress === (nextEpisode - 1)) {
    return `Ep. ${nextEpisode} airing ${formatDistanceToNowStrict(new Date(nextAiringAtUnix * 1000), { addSuffix: true })}`;
  }
  else if (animeStatus === "COMPLETED" && entryStatus === "CURRENT") {
    return `Ep. ${entryEpisodeProgress + 1}`;
  }
  else if (nextEpisode && entryEpisodeProgress < (nextEpisode - 1)) {
    return `Ep. ${entryEpisodeProgress + 1}`;
  }
  return "";
}

const displayWatchedPeriod = (status: string, startedAt?: DetailedDate | null, completedAt?: DetailedDate | null) => {
  if (status !== "COMPLETED" || !startedAt || !completedAt) return null;
  const startDate = createDateFromDetails(startedAt);
  const endDate = createDateFromDetails(completedAt);
  if (!startDate || !endDate) return null;
  return (<span className="text-muted-foreground text-xs">{format(startDate, "PP")} - {format(endDate, "PP")}</span>);
}

const AnimeBodyProgress = ({ anime }: { anime: AnimeDetail }) => {

  // ----- HOOKS -----

  const { localProgress, handleProgressUpdate, isCaughtUp, displayProgress } = useAnimeProgress(anime);

  // ------- LOGIC -------

  if (!anime.mediaListEntry || anime.status === "NOT_YET_RELEASED") return null;

  const statusClass = statusClasses[anime.mediaListEntry?.status || ""] ?? defaultClasses;

  return (
    <div className={cn("w-full rounded-xs overflow-hidden p-[1px]", statusClass.gradient, "animate-in fade-in duration-300")}>
      <div className="bg-background">
        <div className={cn("w-full p-4", statusClass.bg)}>

          {/* HEADER */}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex gap-4 items-center">
                <div className={cn("flex w-8 h-8 p-2 rounded-xs items-center", statusClass.bgMuted)}>
                  <Tv className={statusClass.text} />
                </div>
              </div>
              <p className={cn("text-sm font-medium", statusClass.text)}>
                {displayAnimeEntryStatus(anime.mediaListEntry?.status)}
              </p>
            </div>
            <Badge className={cn("font-semibold", statusClass.text, statusClass.bgMuted)}>
              <span className="font-semibold">{localProgress}</span> <span className="text-muted-foreground font-light">/ {anime.episodes || "?"}</span>
            </Badge>
          </div>

          {/* PROGRESS BAR */}

          <div className="w-full h-2 rounded-xs bg-muted mt-4">
            <Progress value={displayProgress} className={cn(statusClass.gradient)} />
          </div>

          {/* FOOTER */}
          
          <div className="flex justify-between items-center mt-3">
            <span className={cn(statusClass.text, "font-semibold text-sm")}>
              {
                getProgressLabel(anime.status || "", anime.mediaListEntry?.status || "", localProgress, anime.nextAiringEpisode?.airingAt, anime.nextAiringEpisode?.episode)
              }
            </span>
            {displayWatchedPeriod(anime.mediaListEntry?.status || "", anime.mediaListEntry?.startedAt, anime.mediaListEntry?.completedAt)}
            {
              anime.mediaListEntry?.status !== "COMPLETED" && (
                <Button onClick={() => handleProgressUpdate()} disabled={isCaughtUp} size="sm" variant="outline" className="text-xs rounded-xs tracking-tight text-muted-foreground">
                  <Play className="size-3" />
                  Mark watched
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default AnimeBodyProgress;