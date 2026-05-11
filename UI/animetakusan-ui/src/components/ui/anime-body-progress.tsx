import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Play, Tv } from "lucide-react";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { calculateDurationFromSeconds, cn } from "@/lib/utils";
import { Button } from "./button";
import { useState } from "react";

const statusClasses: Record<string, { gradient: string; bg: string; bgMuted: string; text: string }> = {
  "CURRENT": { gradient: "bg-gradient-to-r from-blue-400 to-cyan-600", bg: "bg-blue-400/10", bgMuted: "bg-blue-500/30", text: "text-blue-500" },
  "PLANNING": { gradient: "bg-gradient-to-r from-yellow-500 to-orange-400", bg: "bg-yellow-500/10", bgMuted: "bg-yellow-500/30", text: "text-yellow-500" },
  "COMPLETED": { gradient: "bg-gradient-to-r from-violet-400 to-purple-500", bg: "bg-violet-500/10", bgMuted: "bg-violet-500/30", text: "text-violet-400" },
  "DROPPED": { gradient: "bg-gradient-to-r from-red-400 to-rose-600", bg: "bg-red-500/10", bgMuted: "bg-red-500/30", text: "text-red-500" },
};
const defaultClasses = { gradient: "bg-gradient-to-r from-gray-400 to-gray-600", bg: "bg-gray-500/10", bgMuted: "bg-gray-500/30", text: "text-gray-500" };

const context = (animeStatus: string, entryStatus: string, entryEpisodeProgress: number, nextAiringAt?: number, nextEpisode?: number): string => {

  if (animeStatus === "RELEASING" && nextAiringAt && nextEpisode && entryEpisodeProgress === (nextEpisode - 1)) {
    return `Ep. ${nextEpisode} airing in ${calculateDurationFromSeconds(nextAiringAt)}`;
  }
  else if (animeStatus === "COMPLETED" && entryStatus === "CURRENT") {
    return `Ep. ${entryEpisodeProgress + 1}`;
  }
  else if (entryStatus === "COMPLETED") {
    return `Series completed`;
  }
  else if (nextEpisode && entryEpisodeProgress < (nextEpisode - 1)) {
    return `Ep. ${entryEpisodeProgress + 1}`;
  }
  return "";

}

const AnimeBodyProgress = ({ anime }: { anime: AnimeDetail }) => {

  if (!anime.mediaListEntry || !anime.episodes || anime.status === "NOT_YET_RELEASED") return null;

  const [progress, setProgress] = useState(anime.mediaListEntry?.progress || 0);
  const cls = statusClasses[anime.mediaListEntry?.status || ""] ?? defaultClasses;
  const displayProgress = anime.episodes ? (progress) / anime.episodes * 100 : 0;

  return (
    <div className={cn("w-full rounded-xs overflow-hidden p-[1px]", cls.gradient)}>
      <div className="bg-background">
        <div className={cn("w-full p-4", cls.bg)}>
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className={cn("flex w-8 h-8 p-2 rounded-xs items-center", cls.bgMuted)}>
                <Tv className={cls.text} />
              </div>
            </div>
            <Badge className={cn("font-semibold", cls.text, cls.bgMuted)}>
              <span className="font-semibold">{anime.mediaListEntry?.progress}</span> <span className="text-muted-foreground font-light">/ {anime.episodes || "?"}</span>
            </Badge>
          </div>
          {/* PROGRESS BAR */}
          <div className="w-full h-2 rounded-xs bg-muted mt-4">
            <Progress value={displayProgress} className={cn(cls.gradient)} />
          </div>
          {/* FOOTER */}
          <div className="flex justify-between items-center mt-3">
            <span className={cn(cls.text, "font-semibold tracking-tight text-sm")}>
              {
                context(anime.status || "", anime.mediaListEntry?.status || "", anime.mediaListEntry?.progress || 0, anime.nextAiringEpisode?.timeUntilAiring, anime.nextAiringEpisode?.episode)
              }
            </span>
            {
              anime.mediaListEntry?.status !== "COMPLETED" && (
                <Button disabled={anime.mediaListEntry?.progress === ((anime.nextAiringEpisode?.episode || 0) - 1)} onClick={() => setProgress(progress + 1)} size="sm" variant="outline" className="text-xs rounded-xs tracking-tight text-muted-foreground">
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