import { BookmarkPlus, SquarePen } from "lucide-react";
import type { Anime } from "@/models/common/Anime";
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus";

const AnimeDetailEntryTrigger = ({ anime }: { anime: Anime }) => {
  return (
    anime.mediaListEntry ? (
      <>        
        <span className="font-medium">{displayAnimeEntryStatus(anime.mediaListEntry.status)}</span>
        <div className="flex gap-2 items-center opacity-60 text-xs">
          <span>|</span>
          <span>Edit</span>
          <SquarePen className="shrink-0 size-3" />
        </div>
      </>
    ) : (
      <>
        <BookmarkPlus className="shrink-0" />
        Add to Library
      </>
    )
  )
}
export default AnimeDetailEntryTrigger;