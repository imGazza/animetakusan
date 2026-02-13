import type { Anime } from "@/models/common/Anime";
import AnimeTimeFrame from "./anime-time-frame";
import { cn } from "@/lib/utils";
import AnimeCardScore from "./anime-card-score";
import AnimeCardGenres from "./anime-card-genres";
import AnimeCardStudios from "./anime-card-studios";
import AnimeCardFormat from "./anime-card-format";

interface AnimeCardInfoProps {
  anime: Anime;
  className?: string;
}



const AnimeCardInfo = ({ anime, className }: AnimeCardInfoProps) => {


  return (
    <div className={cn("flex flex-col overflow-hidden h-full gap-4", className)}>
      <div className="flex justify-between gap-2 text-sm text-muted-foreground">
        <AnimeTimeFrame anime={anime} />
        {anime.averageScore && <AnimeCardScore score={anime.averageScore} />}
      </div>
      <div className="text-xs 2xl:text-sm text-accent font-semibold line-clamp-2" style={{ color: anime.coverImage?.color }}>
        {anime.title.native}
      </div>
      <AnimeCardFormat format={anime.format} episodes={anime.episodes ?? 0} duration={anime.duration ?? 0} />
      <AnimeCardStudios studios={anime.studios} color={anime.coverImage.color} />      
      <div className="mt-auto">
        <AnimeCardGenres genres={anime.genres} limit={4} />
      </div>
    </div>
  );
};

export default AnimeCardInfo;