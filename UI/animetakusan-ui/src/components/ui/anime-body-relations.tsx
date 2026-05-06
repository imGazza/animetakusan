import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { displayFormat } from "@/models/common/AnimeFormat";
import { displayAnimeStatus } from "@/models/common/AnimeStatus";
import { AspectRatio } from "./aspect-ratio";
import AnimeImage from "./anime-image";

const AnimeBodyRelations = ({ anime }: { anime: AnimeDetail }) => {

  return (
    <div className="flex flex-col gap-2">
      {anime.relations.map((relation, index) => (
        <Card key={index} className="bg-popover-accent px-2 py-2 rounded-xs gap-1 flex-row items-center">
          <div className="w-14 shrink-0 rounded-xs overflow-hidden">
            <AspectRatio ratio={37 / 53} className="background-muted">
              <AnimeImage
                url={relation.coverImage.large}
                title={relation.title.english || relation.title.romaji || ""} 
                onImageLoad={() => {}} 
              />
            </AspectRatio>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <CardHeader className="px-2 gap-1">
              <CardDescription className="text-muted-foreground/60 text-xs uppercase tracking-wider">{relation.relationType}</CardDescription>
              <CardTitle className="text-sm line-clamp-1">{relation.title.english || relation.title.romaji || relation.title.native}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs tracking-wider text-muted-foreground px-2">
              {displayFormat(relation.format)} • {displayAnimeStatus(relation.status)}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};
export default AnimeBodyRelations;