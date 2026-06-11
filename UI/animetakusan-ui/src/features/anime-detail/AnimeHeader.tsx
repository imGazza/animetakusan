import AnimeDetailFavourite from "@/components/ui/anime-detail-favourite";
import AnimeDetailLibraryEntry from "@/components/ui/anime-detail-library-entry";
import AnimeImage from "@/components/ui/anime-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { displayFormat } from "@/models/common/AnimeFormat";
import { displayAnimeStatus } from "@/models/common/AnimeStatus";
import { Radio } from "lucide-react";

const AnimeHeader = ({ anime }: { anime: AnimeDetail }) => {

  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div className="relative w-full h-[200px] md:h-[400px]">

        {/* BANNER */}

        {anime.bannerImage ? (
          <>
            <div className="absolute -inset-0 animate-in fade-in duration-300" style={{ backgroundImage: `url(${anime.bannerImage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }} >
              <div className="w-full h-full bg-linear-to-b from-(--primary-foreground)/20 to-(--background)" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d1b4e 25%, #0e2444 55%, #0a3d2e 100%)" }} >
              <div className="w-full h-full" style={{ background: "linear-gradient(to bottom, rgba(13,15,20,.1) 0%, rgba(13,15,20,.5) 60%, var(--background) 100%)" }} />
            </div>
          </>
        )}

        {/* ELEMENTS */}

        <Container className="h-full relative flex items-end p-4 py-4 px-3 gap-4">
          <div className="w-28 md:w-54 shrink-0 rounded-xs overflow-hidden">
            <AspectRatio ratio={37 / 53} className="bg-muted">
              <AnimeImage
                url={anime.coverImage.extraLarge}
                title={anime.title.english || anime.title.romaji || ""}
                className="h-full w-full duration-300 object-cover data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-2 md:gap-4 w-full">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-primary/90 font-semibold text-xl md:text-3xl leading-tight line-clamp-2">
                {anime.title.english || anime.title.romaji || ""}
              </h1>
              <div className="text-sm md:text-lg text-primary/70 line-clamp-1">
                {anime.title.native || ""}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs md:text-sm">
              <Badge>
                {anime.status === "RELEASING" && <Radio />}
                {displayAnimeStatus(anime.status)}
              </Badge>
              <Badge variant="ghost">{displayFormat(anime.format)}</Badge>
              {anime.episodes && <Badge variant="ghost">{`${anime.episodes} episode${anime.episodes === 1 ? "" : "s"}`}</Badge>}
            </div>

            {/* ANIME ENTRY COMPONENT */}

            {
              isAuthenticated &&
              <div className="flex items-center gap-2 mt-2">
                <AnimeDetailLibraryEntry anime={anime} />
                <AnimeDetailFavourite anime={anime} />
              </div>
            }

          </div>
        </Container>
      </div>
    </div>
  )
}
export default AnimeHeader;

const AnimeHeaderSkeleton = () => {
  return (
    <div>
      <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden">
        <Container className="h-full relative flex items-end p-4 py-4 px-6 gap-4">
          <div className="w-28 md:w-54 shrink-0 rounded-xs overflow-hidden">
            <AspectRatio ratio={37 / 53}>
              <Skeleton className="h-full w-full rounded-xs" />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-2 md:gap-4 w-full">
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs md:text-sm">
              <Skeleton className="h-4 w-1/4" />
            </div>

          </div>
        </Container>
      </div>
    </div>
  )
}
export { AnimeHeaderSkeleton };
