import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Anime } from "@/models/common/Anime"
import AnimeCardScore from "./anime-card-score"
import AnimeTimeFrame from "./anime-time-frame"
import AnimeCardFormat from "./anime-card-format"
import AnimeCardStudios from "./anime-card-studios"
import AnimeCardGenres from "./anime-card-genres"
import AnimeCardSynopsis from "./anime-card-synopsis"
import AnimeMobileAdd from "./anime-mobile-add"


const AnimeMobileInfo = ({ anime, children, className }: { anime: Anime, children: React.ReactNode, className?: string }) => {

  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent showCloseButton={false} side="bottom" className="p-4 text-md border-none">
          <SheetTitle className="sr-only">{anime.title.english || anime.title.romaji || ""}</SheetTitle>
          <SheetDescription className="sr-only">
            Anime information for {anime.title.english || anime.title.romaji || ""}
          </SheetDescription>
          <div className="flex justify-between gap-2 text-md text-muted-foreground items-center">
            <AnimeTimeFrame anime={anime} />
            {anime.averageScore && <AnimeCardScore score={anime.averageScore} />}
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
          <div className="mt-auto">
            <AnimeCardGenres genres={anime.genres} />
          </div>
          <AnimeMobileAdd />
        </SheetContent>
      </Sheet>
    </div>
  )
}
export default AnimeMobileInfo
