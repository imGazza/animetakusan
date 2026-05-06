import type { Anime } from "@/models/common/Anime";
import AnimeTimeFrame from "./anime-time-frame";
import { cn } from "@/lib/utils";
import AnimeGenres from "./anime-card-genres";
import AnimeCardStudios from "./anime-card-studios";
import AnimeCardFormat from "./anime-card-format";
import AnimeScore from "./anime-score";

interface AnimeCardInfoProps {
  anime: Anime;
  className?: string;
}

const AnimeCardInfo = ({ anime, className }: AnimeCardInfoProps) => {
  return (
    <div className={cn("flex flex-col h-full gap-4", className)}>
      <div className="flex justify-between gap-2 items-center">
        <AnimeTimeFrame anime={anime} />
        <AnimeScore className="text-xs" score={anime.averageScore} />
      </div>
      <div className="text-xs 2xl:text-sm text-accent font-semibold line-clamp-2" style={{ color: anime.coverImage?.color }}>
        {anime.title.native}
      </div>
      <AnimeCardFormat format={anime.format} episodes={anime.episodes ?? 0} duration={anime.duration ?? 0} />
      <AnimeCardStudios studios={anime.studios} color={anime.coverImage.color} />      
      <div className="mt-auto">
        <AnimeGenres genres={anime.genres} limit={2} />
      </div>
    </div>
  );
};

export default AnimeCardInfo;