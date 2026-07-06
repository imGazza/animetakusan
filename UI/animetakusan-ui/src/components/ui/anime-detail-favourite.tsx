import { Heart } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useToggleFavouriteAnime } from "@/features/anime-detail/queries";
import type { Anime } from "@/models/common/Anime";

const AnimeDetailFavourite = ({ anime }: { anime: Anime }) => {

  const { mutate } = useToggleFavouriteAnime(anime.id);

  return (
    <Button
      variant="outline"
      size="sm"
      aria-label={anime.isFavourite ? "Remove from favourites" : "Add to favourites"}
      onClick={() => mutate()}
      className={anime.isFavourite
        ? "border-rose-500/60 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-xs"
        : "border-primary/20 text-primary/60 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-xs"
      }
    >
      <Heart
        className={cn(
          "size-4 transition-all duration-200",
          `${anime.isFavourite ? "fill-rose-400 stroke-rose-400 scale-110" : "fill-transparent"}`
        )}
      />
      <span className="hidden sm:inline">
        {anime.isFavourite ? "Favourited" : "Favourite"}
      </span>
    </Button>
  )
}
export default AnimeDetailFavourite;