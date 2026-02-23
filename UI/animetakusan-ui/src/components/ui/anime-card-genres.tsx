import { cn } from "@/lib/utils";
import { Badge } from "./badge";

const AnimeCardGenres = ({ genres, limit = 10, className }: { genres: string[], limit?: number, className?: string }) => {

  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-auto">
      {genres.slice(0, limit).map((genre) => (
        <Badge key={genre} variant="outline" className={cn("text-sm md:text-xs text-muted-foreground", className)}>
          {genre}
        </Badge>
      ))}
    </div>
  )
}
export default AnimeCardGenres;