import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { AspectRatio } from "./aspect-ratio";
import AnimeImage from "./anime-image";

const AnimeBodyRecommendations = ({ anime }: { anime: AnimeDetail }) => {
  return (
    <div className="flex gap-3 overflow-x-auto px-2 snap-x snap-mandatory no-scrollbar">
      {anime.recommendations.filter(rec => rec).map((recommendation, index) => (
        <div
          key={index}
          className="flex-none w-28 sm:w-32 snap-start rounded-xs overflow-hidden bg-popover-accent flex flex-col"
        >
          <AspectRatio ratio={37 / 53} className="bg-muted">
            <AnimeImage 
              url={recommendation.coverImage.large}
              title={recommendation.title.english || recommendation.title.romaji || ""}
              onImageLoad={() => {}}
            />
          </AspectRatio>
          <div className="p-2 flex flex-col flex-1 justify-between gap-1">
            <p className="text-xs font-semibold leading-tight line-clamp-2">
              {recommendation.title.english || recommendation.title.romaji || recommendation.title.native}
            </p>
            {recommendation.averageScore && (
              <p className="text-xs text-accent uppercase tracking-wider font-medium">
                {recommendation.averageScore}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeBodyRecommendations;