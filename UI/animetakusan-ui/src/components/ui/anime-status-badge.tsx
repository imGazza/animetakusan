import type { MediaListEntry } from "@/models/common/Anime";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus";

const statusClasses: Record<string, string> = {
  "CURRENT": "bg-cyan-500",
  "PLANNING": "bg-yellow-500",
  "COMPLETED": "bg-violet-500",
  "DROPPED": "bg-red-500",
};

const AnimeStatusBadge = ({ animeEntry, imageLoaded, handleAddToLibrary }: { animeEntry: MediaListEntry | null, imageLoaded: boolean, handleAddToLibrary: (e: React.MouseEvent) => void }) => {


  return (
    <>
      {
        animeEntry ? (
          <div className={cn(
            "absolute left-1 top-1 z-10 py-1 px-2 group-hover:bg-muted rounded-xs flex gap-2 items-center transition-colors duration-200 pointer-events-none opacity-100",
            !imageLoaded && "opacity-0"
          )}>
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full flex items-center gap-1 text-accent-foreground text-[10px] font-semibold pointer-events-none",
                statusClasses[animeEntry.status]
              )} />
            <span className="tracking-wide text-muted-foreground font-semibold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">{displayAnimeEntryStatus(animeEntry.status)}</span>
          </div>
        ) : (
          <Button
            variant="default"
            onClick={handleAddToLibrary}
            size="xs"
            className="bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground p-0 hidden lg:flex absolute left-1 top-1 z-10 items-center gap-1 text-[10px] font-semibold rounded-xs opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-in-out"
          >
            <Plus className="w-2.5 h-2.5 shrink-0" />
            <span className="tracking-wide">Add to Library</span>
          </Button>
        )
      }
    </>

  )
}
export default AnimeStatusBadge;