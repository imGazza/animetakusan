import { BookmarkPlus, SquarePen } from "lucide-react";
import type { Anime } from "@/models/common/Anime";
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus";

const AnimeDetailEntryTrigger = ({ anime }: { anime: Anime }) => {
  return (
    anime.mediaListEntry ? (
      <>
        <SquarePen className="shrink-0" />
        <span className="font-medium">{displayAnimeEntryStatus(anime.mediaListEntry.status)}</span>
        {
          anime.mediaListEntry.progress !== 0 ? (
            <>
              <span className="opacity-60 text-xs">|</span>
              <span className="opacity-80 text-xs">Ep {anime.mediaListEntry.progress} / {anime.episodes || "?"}</span>
            </>
          ) : null
        }
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