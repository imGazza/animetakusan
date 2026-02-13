import type { Anime } from "@/models/common/Anime"
import { AspectRatio } from "./aspect-ratio"
import { Info } from "lucide-react"
import AnimeCardInfo from "./anime-card-info"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
import { useEffect, useRef, useState } from "react"
import { Button } from "./button"
import AnimeMobileInfo from "./anime-mobile-info"

interface AnimeCardProps {
  anime: Anime
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [triggerHeight, setTriggerHeight] = useState<number>(0)
  const [triggerWidth, setTriggerWidth] = useState<number>(0)
  const [isXlScreen, setIsXlScreen] = useState(() => window.innerWidth >= 1280)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)')
    const handler = (e: MediaQueryListEvent) => setIsXlScreen(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

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

  const CardContent = (
    <div className="flex relative animate-in zoom-in-85 duration-200 ease-in-out cursor-pointer">
      <div ref={triggerRef} className="group flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width)">
        <AspectRatio ratio={37 / 53} className="bg-muted rounded-sm overflow-hidden relative">
          <img
            src={anime.coverImage.extraLarge}
            alt={anime.title.english || anime.title.romaji || ""}
            className="h-full w-full object-cover group-hover:scale-[1.1] transition-transform duration-300 ease-in-out will-change-transform animate-in fade-in-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 md:via-transparent to-black/60 md:to-black/20" />
          <div
            className="absolute bottom-0 w-full h-full"
          />
          <AnimeMobileInfo anime={anime} className="xl:hidden">
            <Button variant="ghost" size="icon" className="size-8 absolute right-1 top-1 rounded-full bg-black/10 backdrop-blur-[2px]">
              <Info className="size-4" />
            </Button>
          </AnimeMobileInfo>
          <div className="absolute bottom-2 px-1 md:px-2 text-xs md:text-md tracking-wide font-medium leading-tight text-foreground line-clamp-2">
            {anime.title.english || anime.title.romaji || ""}
          </div>
        </AspectRatio>
      </div>
    </div>
  )

  if (!isXlScreen) {
    return CardContent
  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        {CardContent}
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        sideOffset={8}
        className="max-w-(--md-image-width) pointer-events-none border-none"
        style={{ height: triggerHeight ? `${triggerHeight}px` : 'auto', width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
      >
        <AnimeCardInfo anime={anime} />
      </HoverCardContent>
    </HoverCard>
  )
}
export default AnimeCard;