import type { Anime } from "@/models/common/Anime";
import { useAnimeProgress } from "@/hooks/useAnimeProgress";
import { Progress } from "./progress";
import { Button } from "./button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const statusProgressClass: Record<string, string> = {
  "CURRENT":   "bg-gradient-to-r from-blue-400 to-cyan-600",
  "PLANNING":  "bg-gradient-to-r from-yellow-500 to-orange-400",
  "COMPLETED": "bg-gradient-to-r from-violet-400 to-purple-500",
  "DROPPED":   "bg-gradient-to-r from-red-400 to-rose-600",
};
const defaultProgressClass = "bg-gradient-to-r from-gray-400 to-gray-600";

const AnimeCardProgress = ({ anime }: { anime: Anime }) => {
  if (!anime.mediaListEntry || anime.status === "NOT_YET_RELEASED") return null;

  const { localProgress, handleProgressUpdate, isCaughtUp, displayProgress } = useAnimeProgress(anime);

  const isCompleted = anime.mediaListEntry.status === "COMPLETED";
  const progressClass = statusProgressClass[anime.mediaListEntry.status] ?? defaultProgressClass;

  return (
    <div className="flex items-center gap-2 w-full mt-1.5 px-0.5">
      <div className="flex-1 flex flex-col gap-1">
        <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
          <Progress value={displayProgress} className={cn(progressClass)} />
        </div>
        <span className="text-[10px] text-muted-foreground leading-none">
          {localProgress}<span className="opacity-50"> / {anime.episodes ?? "?"}</span>
        </span>
      </div>
      {!isCompleted && (
        <Button
          size="icon-xs"
          variant="outline"
          disabled={isCaughtUp}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleProgressUpdate(); }}
          className="rounded-xs text-muted-foreground hover:text-foreground"
          aria-label="Mark episode watched"
        >
          <Plus className="size-3.5" />
        </Button>
      )}
    </div>
  );
};

export default AnimeCardProgress;
