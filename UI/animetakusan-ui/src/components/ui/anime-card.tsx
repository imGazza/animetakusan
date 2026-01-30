import type { Anime } from "@/models/common/Anime"
import { AspectRatio } from "./aspect-ratio"

interface AnimeCardProps {
  anime: Anime
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <div className="flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width)">
      <AspectRatio ratio={37 / 53} className="bg-muted rounded-sm overflow-hidden">
        <img
          src={anime.coverImage.extraLarge}
          alt={anime.title.english || anime.title.romaji || ""}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
      <div className="mt-2 text-xs md:text-md tracking-wide font-medium leading-tight text-muted-foreground line-clamp-2 hover:text-foreground transition-colors duration-200">
        {anime.title.english || anime.title.romaji || ""}
      </div>
    </div>
  )
}
export default AnimeCard;