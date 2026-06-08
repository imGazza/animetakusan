import type { MediaListEntry } from "@/models/common/Anime";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus";

const statusClasses: Record<string, string> = {
  "CURRENT": "bg-cyan-500 shadow-cyan-500/50",
  "PLANNING": "bg-yellow-500 shadow-yellow-500/50",
  "COMPLETED": "bg-violet-500 shadow-violet-500/50",
  "DROPPED": "bg-red-500 shadow-red-500/50",
};

const AnimeStatusBadge = ({ animeEntry, imageLoaded, handleAddToLibrary }: { animeEntry: MediaListEntry | null, imageLoaded: boolean, handleAddToLibrary: (e: React.MouseEvent) => void }) => {


  return (
    <>
      {
        animeEntry ? (
          <>
            <div className={cn(
              "absolute top-0 left-0 right-0",
              "h-[3px] group-hover:h-5",
              "transition-all duration-200 ease-in-out",
              "flex items-center justify-center",
              imageLoaded ? "opacity-100" : "opacity-0",
              statusClasses[animeEntry.status]
            )}>
              <span className={cn(
                "text-xs font-medium tracking-wide text-transparent",
                "group-hover:text-primary transition-colors duration-100 delay-100",
                "whitespace-nowrap select-none"
              )}>
                {displayAnimeEntryStatus(animeEntry.status)}
              </span>
            </div>
          </>
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