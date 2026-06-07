import type { Anime } from "@/models/common/Anime"
import { AspectRatio } from "./aspect-ratio"
import { Info, Plus } from "lucide-react"
import AnimeCardInfo from "./anime-card-info"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
import { memo, useCallback, useRef, useState } from "react"
import { Button } from "./button"
import AnimeMobileInfo from "./anime-mobile-info"
import { Skeleton } from "./skeleton"
import AnimeImage from "./anime-image"
import { useNavigate } from "react-router"
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert"
import { useAnimeEntryMutation } from "@/features/queries"
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus"
import { cn } from "@/lib/utils"

const statusClasses: Record<string, string> = {
  "CURRENT": "bg-cyan-500",
  "PLANNING": "bg-yellow-500",
  "COMPLETED": "bg-violet-500",
  "DROPPED": "bg-red-500",
};

const AnimeCard = memo(({ anime }: { anime: Anime }) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [cardSize, setCardSize] = useState<{ height: number; width: number }>({ height: 0, width: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useAnimeEntryMutation();

  const handleImageLoad = useCallback(() => setImageLoaded(true), [])

  // This is done to resize the HoverCardContent to match the Card size (subject to change when the page gets resized)
  const handleHoverCardOpenChange = useCallback((open: boolean) => {
    if (open && triggerRef.current) {
      setCardSize({ height: triggerRef.current.clientHeight, width: triggerRef.current.clientWidth })
    }
  }, [])

  const handleAddToLibrary = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (anime.mediaListEntry) return; // Already in library, do nothing

    const entry: AnimeEntryUpsert = {
      mediaId: anime.id,
      status: "PLANNING",
      progress: null,
      startedAt: null,
      completedAt: null,
      score: null,
    }
    mutate(entry);
  }, [anime.id, mutate])

  return (
    <HoverCard openDelay={0} closeDelay={0} onOpenChange={handleHoverCardOpenChange}>
      <HoverCardTrigger asChild>
        <div className="flex relative cursor-pointer" onClick={() => { !mobileDrawerOpen && navigate(`/anime/${anime.id}`) }}>
          <div ref={triggerRef} className="group flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width)">
            <AspectRatio ratio={37 / 53} data-state={imageLoaded ? 'loaded' : 'loading'} className="bg-muted rounded-sm overflow-hidden relative transform-opacity data-[state=loaded]:opacity-100 data-[state=loading]:opacity-50">
              <AnimeImage
                url={anime.coverImage.extraLarge}
                title={anime.title.english || anime.title.romaji || ""}
                onImageLoad={handleImageLoad}
                className="duration-300 lg:group-hover:scale-[1.1] ease-in-out will-change-transform data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0"
              />
              <div data-state={imageLoaded ? 'loaded' : 'loading'} className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 md:via-black/10 to-black/60 md:to-black/60 duration-300 ease-in-out data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0" />
              <AnimeMobileInfo anime={anime} className="lg:hidden" onAddToLibrary={() => handleAddToLibrary} onOpenChange={setMobileDrawerOpen}>
                <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon" className="absolute right-1 top-1 size-6 rounded-full bg-black/10 text-primary backdrop-blur-[2px]">
                  <Info className="size-4" />
                </Button>
              </AnimeMobileInfo>
              {
                anime.mediaListEntry ? (
                  // <div className="absolute left-1.5 top-1.5 z-10 flex items-center gap-1 bg-accent/90 text-accent-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-xs pointer-events-none opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  //   <Check className="w-2.5 h-2.5 shrink-0" />
                  //   <span className="hidden lg:inline tracking-wide">In Library</span>
                  // </div>
                  <div className="absolute left-1 top-1 z-10 py-1 px-2 group-hover:bg-muted rounded-xs flex gap-2 items-center transition-colors duration-200 pointer-events-none">
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full flex items-center gap-1 text-accent-foreground text-[10px] font-semibold pointer-events-none",
                        statusClasses[anime.mediaListEntry.status]
                      )} />
                    <span className="tracking-wide text-muted-foreground font-semibold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">{displayAnimeEntryStatus(anime.mediaListEntry.status)}</span>
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
              <div data-state={imageLoaded ? 'loaded' : 'loading'} className="absolute bottom-2 px-1 md:px-2 text-xs md:text-md tracking-wide font-medium leading-tight text-white line-clamp-2 duration-300 ease-in-out data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0">
                {anime.title.english || anime.title.romaji || ""}
              </div>
            </AspectRatio>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        sideOffset={8}
        className="hidden lg:block max-w-(--md-image-width) pointer-events-none border-none"
        style={{ height: cardSize.height ? `${cardSize.height}px` : 'auto', width: cardSize.width ? `${cardSize.width}px` : 'auto' }}
      >
        <AnimeCardInfo anime={anime} />
      </HoverCardContent>
    </HoverCard>
  )
})
AnimeCard.displayName = 'AnimeCard'
export default AnimeCard;

const AnimeCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width) animate-in zoom-in-85 duration-300 ease-in-out">
      <AspectRatio ratio={37 / 53} className="rounded-sm overflow-hidden">
        <Skeleton className="h-full w-full" />
      </AspectRatio>
    </div>
  )
}
export { AnimeCardSkeleton }
