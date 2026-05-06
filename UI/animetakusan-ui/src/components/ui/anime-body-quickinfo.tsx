import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./item";
import { cn } from "@/lib/utils";
import AnimeScore from "./anime-score";

const AnimeBodyQuickInfo = ({ anime }: { anime: AnimeDetail }) => {



  return (
    <div className="flex gap-2 w-full">
      <Item
        variant="outline"
        className={cn(
          "bg-muted w-full text-muted-foreground rounded-xs cursor-pointer transition-colors p-4"
        )}
      >
        <ItemContent className="items-center gap-1">
          <ItemTitle>
            <AnimeScore className="text-lg" score={anime.averageScore} />
          </ItemTitle>
          <ItemDescription className="text-muted-foreground/50 text-xs tracking-wider">
            Score
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item
        variant="outline"
        className={cn(
          "bg-muted w-full text-muted-foreground rounded-xs cursor-pointer transition-colors p-4"
        )}
      >
        <ItemContent className="items-center gap-1">
          <ItemTitle className="text-2xl font-bold leading-none">
            {anime.popularity?.toLocaleString()}
          </ItemTitle>
          <ItemDescription className="text-muted-foreground/50 text-xs tracking-wider">
            Popularity
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item
        variant="outline"
        className={cn(
          "bg-muted w-full text-muted-foreground rounded-xs cursor-pointer transition-colors p-4"
        )}
      >
        <ItemContent className="items-center gap-1">
          <ItemTitle className="text-2xl font-bold leading-none">
            {anime.favourites?.toLocaleString()}
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