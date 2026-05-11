import AnimeDetailLibraryEntry from "@/components/ui/anime-detail-library-entry";
import AnimeImage from "@/components/ui/anime-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Container from "@/components/ui/container";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { displayFormat } from "@/models/common/AnimeFormat";
import { displayAnimeStatus } from "@/models/common/AnimeStatus";
import { Radio } from "lucide-react";

const AnimeHeader = ({ anime }: { anime: AnimeDetail }) => {

  // TODO: Metti gradiente random se manca banner image
  // TODO: Metti lo score col tondino su top all time e sul dettaglio per mobile

  return (
    <div>
      <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden">
        {anime.bannerImage &&
          <>
            <div className="absolute inset-0" style={{ backgroundImage: `url(${anime.bannerImage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute -inset-px bg-linear-to-b from-(--primary-foreground)/20 to-(--background)" />
          </>
        }
        <Container className="h-full relative flex items-end p-4 py-4 px-6 gap-4">
          <div className="w-28 md:w-50 shrink-0 rounded-xs overflow-hidden">
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
                { anime.status === "RELEASING" && <Radio /> }
                {displayAnimeStatus(anime.status)}
              </Badge>
              <Badge variant="ghost">{displayFormat(anime.format)}</Badge>
              {anime.episodes && <Badge variant="ghost">{`${anime.episodes} episode${anime.episodes === 1 ? "" : "s"}`}</Badge>}
            </div>

            <div className="flex gap-4">
              <AnimeDetailLibraryEntry anime={anime} />
            </div>

          </div>
        </Container>
      </div>
    </div>
  )
}
export default AnimeHeader;

// {anime.title.english || anime.title.romaji}