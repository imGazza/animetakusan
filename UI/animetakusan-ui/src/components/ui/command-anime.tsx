import type { Anime } from "@/models/common/Anime"
import { AspectRatio } from "./aspect-ratio"
import { displayFormat } from "@/models/common/AnimeFormat";

const CommandAnime = ({ anime }: { anime: Anime }) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="rounded-xs bg-muted h-10 w-10">
        <AspectRatio ratio={1 / 1} className="overflow-hidden">
          <img
            src={anime.coverImage.large}
            alt={anime.title.english || anime.title.romaji || anime.title.native || ''}
            className="object-cover object-center rounded-xs w-full h-full"
          />
        </AspectRatio>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <span style={{ color: anime.coverImage.color }}>{anime.title.english || anime.title.romaji || anime.title.native}</span>
        <div className="flex items-center gap-1 text-xs">
          <span>{anime.seasonYear || anime.startDate?.year || 'N/A'}</span>
          <span>•</span>
          <span>{displayFormat(anime.format)}</span>
        </div>
      </div>
    </div>
  )
}
export default CommandAnime;