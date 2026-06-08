import type { Anime } from "@/models/common/Anime"
import { AspectRatio } from "./aspect-ratio"
import { Info } from "lucide-react"
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
import { cn } from "@/lib/utils"
import AnimeStatusBadge from "./anime-status-badge"
import useMediaQuery, { DESKTOP_BREAKPOINT } from "@/hooks/useMediaQuery"

const AnimeCard = memo(({ anime }: { anime: Anime }) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [cardSize, setCardSize] = useState<{ height: number; width: number }>({ height: 0, width: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useAnimeEntryMutation();
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

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
        <div ref={triggerRef} onClick={() => { !mobileDrawerOpen && navigate(`/anime/${anime.id}`) }} className="group flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width) relative cursor-pointer">
          <AspectRatio
            ratio={37 / 53}
            data-state={imageLoaded ? 'loaded' : 'loading'}
            className={cn(
              "group/image bg-muted rounded-sm overflow-hidden relative",
              "transform-opacity data-[state=loaded]:opacity-100 data-[state=loading]:opacity-50 duration-200"
            )}>

            {/* IMAGE & SHADOW GRADIENT */}

            <AnimeImage
              url={anime.coverImage.extraLarge}
              title={anime.title.english || anime.title.romaji || ""}
              onImageLoad={handleImageLoad}
              className="duration-300 lg:group-hover:scale-[1.1] ease-in-out will-change-transform data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0"
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b from-transparent via-black/10 md:via-black/10 to-black/60 md:to-black/60",
              "duration-300 ease-in-out group-data-[state=loaded]/image:opacity-100 group-data-[state=loading]/image:opacity-0"
            )} />

            {/* STATUS BADGE & MOBILE INFO BUTTON */}

            <AnimeStatusBadge animeEntry={anime.mediaListEntry} imageLoaded={imageLoaded} handleAddToLibrary={handleAddToLibrary} />
            {
              !isDesktop &&
              <AnimeMobileInfo anime={anime} className="lg:hidden" onAddToLibrary={handleAddToLibrary} onOpenChange={setMobileDrawerOpen}>
                <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="icon" className="absolute right-1 top-1 size-6 rounded-full bg-black/10 text-primary backdrop-blur-[2px]">
                  <Info className="size-4" />
                </Button>
              </AnimeMobileInfo>
            }

            {/* BOTTOM TITLE */}

            <div className={cn(
              "absolute bottom-2 px-1 md:px-2 text-xs md:text-md tracking-wide font-medium leading-tight text-white line-clamp-2",
              "duration-300 ease-in-out group-data-[state=loaded]/image:opacity-100 group-data-[state=loading]/image:opacity-0"
            )}>
              {anime.title.english || anime.title.romaji || ""}
            </div>

          </AspectRatio>
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
