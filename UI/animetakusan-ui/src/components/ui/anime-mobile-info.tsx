import type { Anime } from "@/models/common/Anime"
import AnimeTimeFrame from "./anime-time-frame"
import AnimeCardFormat from "./anime-card-format"
import AnimeCardStudios from "./anime-card-studios"
import AnimeGenres from "./anime-card-genres"
import AnimeCardSynopsis from "./anime-card-synopsis"
import AnimeScore from "./anime-score"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTrigger } from "./drawer"
import { Button } from "./button"
import { BookmarkCheck, BookmarkPlus } from "lucide-react"


const AnimeMobileInfo = ({ anime, children, className, onAddToLibrary, onOpenChange }: { anime: Anime, children: React.ReactNode, className?: string, onAddToLibrary?: () => void, onOpenChange?: (open: boolean) => void }) => {

  return (
    <div className={className}>
      <Drawer onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent className="p-4 text-md border-none">
          <DrawerHeader className="sr-only">{anime.title.english || anime.title.romaji || ""}</DrawerHeader>
          <DrawerDescription className="sr-only">
            Anime information for {anime.title.english || anime.title.romaji || ""}
          </DrawerDescription>
          <div className="overflow-y-auto no-scrollbar p-2">
            <div className="flex justify-between gap-2 text-md text-muted-foreground items-center ">
              <AnimeTimeFrame anime={anime} />
              {anime.averageScore && <AnimeScore className="text-sm" score={anime.averageScore} />}
            </div>
            <div className="flex flex-col gap-1 my-3">
              <h2 className="text-xl font-bold tracking-tight" style={{ color: anime.coverImage.color }}>
                {anime.title.english || anime.title.romaji || ""}
              </h2>
              {anime.title.native && (
                <p className="text-sm text-muted-foreground font-medium tracking-wide">
                  {anime.title.native}
                </p>
              )}
            </div>
            <AnimeCardFormat format={anime.format} episodes={anime.episodes ?? 0} duration={anime.duration ?? 0} />
            <AnimeCardStudios studios={anime.studios} color={anime.coverImage.color} />
            <AnimeCardSynopsis description={anime.description} />
            <AnimeGenres genres={anime.genres} />
          </div>

          <DrawerFooter className="px-2">
            <Button disabled={!!anime.mediaListEntry} onClick={onAddToLibrary} size="icon" variant="outline" className="p-2 rounded-xs w-full tracking-wide text-muted-foreground" >
              {
                anime.mediaListEntry ?
                <><BookmarkCheck className="size-4" /> Already in library</> :
                <><BookmarkPlus className="size-4 ml-2" /> Add to library</>
              }
            </Button>
          </DrawerFooter>

        </DrawerContent>
      </Drawer>
    </div>
  )
}
export default AnimeMobileInfo
