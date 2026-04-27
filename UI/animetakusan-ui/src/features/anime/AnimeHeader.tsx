import AnimeDetailLibrary from "@/components/ui/anime-detail-library";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/container";
import type { Anime } from "@/models/common/Anime";
import { displayFormat } from "@/models/common/AnimeFormat";
import { displayAnimeStatus } from "@/models/common/AnimeStatus";
import { Radio } from "lucide-react";

const AnimeHeader = ({ anime }: { anime: Anime }) => {
  return (
    <div>
      <div className="relative w-full h-[200px] md:h-[400px]">
        {anime.bannerImage &&
          <>
            <div className="absolute inset-0" style={{ backgroundImage: `url(${anime.bannerImage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute -inset-px bg-linear-to-b from-black/40 to-(--background)" />
          </>
        }
        <Container className="h-full relative flex items-end p-4 py-4 px-6 gap-4">
          <div className="w-25 shrink-0 rounded-xs overflow-hidden">
            <AspectRatio ratio={37 / 53}>
              <img
                src={anime.coverImage.extraLarge}
                alt={anime.title.english || anime.title.romaji || ""}
                loading="lazy"
                className="h-full w-full duration-300 object-cover lg:group-hover:scale-[1.1] ease-in-out will-change-transform data-[state=loaded]:opacity-100 data-[state=loading]:opacity-0"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-0.5">
              <h1 className="font-semibold text-xl leading-tight line-clamp-1">
                {anime.title.english || anime.title.romaji || ""}
              </h1>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {anime.title.native || ""}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge>
                { anime.status === "RELEASING" && <Radio /> }
                {displayAnimeStatus(anime.status)}
              </Badge>
              <Badge variant="outline">{displayFormat(anime.format)}</Badge>
              {anime.episodes && <Badge variant="outline">{`${anime.episodes} episode${anime.episodes === 1 ? "" : "s"}`}</Badge>}
            </div>

            <AnimeDetailLibrary anime={anime} />

          </div>
        </Container>
      </div>
    </div>
  )
}
export default AnimeHeader;

// {anime.title.english || anime.title.romaji}