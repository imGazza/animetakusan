import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { AspectRatio } from "./aspect-ratio";
import AnimeImage from "./anime-image";
import { Badge } from "./badge";
import { cn, scoreBadgeClass } from "@/lib/utils";

const AnimeBodyRecommendations = ({ anime }: { anime: AnimeDetail }) => {

  if(anime.recommendations.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 bg-muted border p-3 px-4 rounded-xs">
      <div className="font-semibold text-xs text-muted-foreground/50 uppercase tracking-widest">
        Recommendations
      </div>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar md:snap-none md:grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
        {anime.recommendations.filter(rec => rec).map((recommendation, index) => (
          <div
            key={index}
            className="flex-none w-32 md:w-26 lg:w-32 snap-start rounded-xs overflow-hidden bg-popover-accent/50 flex flex-col"
          >
            <AspectRatio ratio={37 / 53} className="bg-muted">
              <AnimeImage
                url={recommendation.coverImage.large}
                title={recommendation.title.english || recommendation.title.romaji || ""}
              />
            </AspectRatio>
            <div className="p-2 flex flex-col flex-1 justify-between gap-1">
              <p className="text-xs font-semibold leading-tight text-primary/90 line-clamp-2">
                {recommendation.title.english || recommendation.title.romaji || recommendation.title.native}
              </p>
              {recommendation.averageScore && (
                <Badge className={cn("shrink-0 rounded-xs border px-1.5 py-0 text-xs font-bold", scoreBadgeClass(recommendation.averageScore))}>
                  {recommendation.averageScore}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeBodyRecommendations;