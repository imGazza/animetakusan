import type { Anime } from "@/models/common/Anime";
import { Card } from "./card";
import { AspectRatio } from "./aspect-ratio";
import AnimeCardGenres from "./anime-card-genres";
import AnimeCardScore from "./anime-card-score";
import AnimeCardFormat from "./anime-card-format";
import AnimeTimeFrame from "./anime-time-frame";

const AnimeTopCard = ({ anime, index }: { anime: Anime, index: number }) => {
  return (
    <Card className="w-full bg-muted rounded-xs border border-none p-2">
      <div className="flex gap-4">
        <div className="w-20 md:w-26 h-full shrink-0">
          <AspectRatio ratio={37 / 53} className="bg-muted rounded-xs overflow-hidden relative">
            <img
              src={anime.coverImage.extraLarge}
              alt={anime.title.english || anime.title.romaji || ""}
              className="object-cover h-full w-full"
            />
          </AspectRatio>
        </div>

        <div className="flex flex-col gap-1 py-2">
          <div className="text-muted-foreground text-md md:text-lg font-semibold tracking-wide line-clamp-1" style={{ color: anime.coverImage.color || "inherit" }}>
            {anime.title.english || anime.title.romaji}
          </div>
          <div className="text-muted-foreground text-sm md:text-md line-clamp-1">
            {anime.title.native || ""}
          </div>
          <AnimeCardGenres genres={anime.genres} limit={3} className="text-xs" />
        </div>

        <div className="hidden md:flex justify-center items-center p-4 md:p-8 ml-auto gap-8 ">
          <div className="w-16">
            {anime.averageScore && <AnimeCardScore score={anime.averageScore} />}
          </div>
          <div className="w-40">
            <AnimeCardFormat format={anime.format} episodes={anime.episodes ?? 0} duration={anime.duration ?? 0} />
          </div>
          <div className="w-30">
            <AnimeTimeFrame anime={anime} />
          </div>
        </div>

        <div className="flex flex-col justify-center text-2xl p-4 md:p-8 md:text-4xl font-bold text-muted-foreground md:w-30 md:items-center max-md:ml-auto">
          {index}
        </div>
      </div>
    </Card>
  );
}
export default AnimeTopCard;