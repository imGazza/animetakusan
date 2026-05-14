import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./item";
import { cn } from "@/lib/utils";
import AnimeScore from "./anime-score";

const AnimeBodyQuickInfo = ({ anime }: { anime: AnimeDetail }) => {



  return (
    <div className="flex gap-2 w-full animate-in fade-in duration-300">
      <Item
        variant="outline"
        className={cn(
          "bg-muted w-full text-muted-foreground rounded-xs transition-colors p-4"
        )}
      >
        <ItemContent className="items-center gap-1">
          <ItemTitle>
            { anime.averageScore ? <AnimeScore className="text-md md:text-lg" score={anime.averageScore} /> : <span className="text-2xl font-bold leading-none">-</span> }
          </ItemTitle>
          <ItemDescription className="text-muted-foreground/50 text-xs tracking-wider">
            Score
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item
        variant="outline"
        className={cn(
          "bg-muted w-full text-muted-foreground rounded-xs transition-colors p-4"
        )}
      >
        <ItemContent className="items-center gap-1">
          <ItemTitle className="text-2xl font-bold leading-none">
            {anime.popularity ? anime.popularity.toLocaleString() : "-"}
          </ItemTitle>
          <ItemDescription className="text-muted-foreground/50 text-xs tracking-wider">
            Popularity
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item
        variant="outline"
        className={cn(
          "bg-muted w-full text-muted-foreground rounded-xs transition-colors p-4"
        )}
      >
        <ItemContent className="items-center gap-1">
          <ItemTitle className="text-2xl font-bold leading-none">
            {anime.favourites ? anime.favourites.toLocaleString() : "-"}
          </ItemTitle>
          <ItemDescription className="text-muted-foreground/50 text-xs tracking-wider">
            Favorites
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
export default AnimeBodyQuickInfo;