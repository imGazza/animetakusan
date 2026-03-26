import type { Anime } from "@/models/common/Anime"
import { AspectRatio } from "./aspect-ratio"
import { BookmarkPlus, Info } from "lucide-react"
import AnimeCardInfo from "./anime-card-info"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
import { useEffect, useRef, useState } from "react"
import { Button } from "./button"
import AnimeMobileInfo from "./anime-mobile-info"
import AnimeAdd from "./anime-add"
import { Skeleton } from "./skeleton"
import AnimeCardImage from "./anime-card-image"

const AnimeCard = ({ anime }: { anime: Anime }) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [triggerHeight, setTriggerHeight] = useState<number>(0)
  const [triggerWidth, setTriggerWidth] = useState<number>(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!triggerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTriggerHeight(entry.target.clientHeight)
        setTriggerWidth(entry.target.clientWidth)
      }
    })

    resizeObserver.observe(triggerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="flex relative cursor-pointer">
          <div ref={triggerRef} className="group flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width)">
            <AspectRatio ratio={37 / 53} data-state={imageLoaded ? 'loaded' : 'loading'} className="bg-muted rounded-sm overflow-hidden relative transform-opacity data-[state=loaded]:opacity-100 data-[state=loading]:opacity-50">
              <AnimeCardImage 
                url={anime.coverImage.extraLarge} 
                title={anime.title.english || anime.title.romaji || ""} 
                onImageLoad={() => setImageLoaded(true)} 
                className="h-full w-full object-cover lg:group-hover:scale-[1.1] transition-all duration-300 ease-in-out will-change-transform"/>
              <AnimeAdd>
                <Button variant="ghost" size="icon" className="bg-background text-muted-foreground size-8 absolute right-1 top-1 rounded-full z-10 opacity-0 scale-[.40] pointer-events-none lg:group-hover:opacity-80 lg:group-hover:scale-[1] lg:group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
                  <BookmarkPlus className="size-4" />
                </Button>
              </AnimeAdd>
              <div data-state={imageLoaded ? 'loaded' : 'loading'} className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 md:via-black/10 to-black/60 md:to-black/60 duration-300 ease-in-out data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0"/>
              <AnimeMobileInfo anime={anime} className="lg:hidden">
                <Button variant="ghost" size="icon" className="size-6 absolute right-1 top-1 rounded-full bg-black/10 backdrop-blur-[2px]">
                  <Info className="size-4" />
                </Button>
              </AnimeMobileInfo>
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
        style={{ height: triggerHeight ? `${triggerHeight}px` : 'auto', width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
      >
        <AnimeCardInfo anime={anime} />
      </HoverCardContent>
    </HoverCard>
  )
}
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
