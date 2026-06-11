import { useState } from "react";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { displayFormat } from "@/models/common/AnimeFormat";
import { displayAnimeStatus } from "@/models/common/AnimeStatus";
import { AspectRatio } from "./aspect-ratio";
import AnimeImage from "./anime-image";
import { Button } from "./button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const INITIAL_VISIBLE = 4;
const RELATION_ORDER: Record<string, number> = {
  Source: 0,
  Prequel: 1,
  Sequel: 2,
  Parent: 3,
  SideStory: 4,
  Character: 5,
  Summary: 6,
  Alternative: 7,
  SpinOff: 8,
  Other: 9,
  Compilation: 10,
  Contains: 11
};

const AnimeBodyRelations = ({ anime }: { anime: AnimeDetail }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  if (anime.relations.length === 0) return null;

  const sortedRelations = [...anime.relations].sort(
    (a, b) =>
      (RELATION_ORDER[a.relationType] ?? 99) -
      (RELATION_ORDER[b.relationType] ?? 99)
  );

  const hasMore = anime.relations.length > INITIAL_VISIBLE;
  const visibleRelations = showAll ? sortedRelations : sortedRelations.slice(0, INITIAL_VISIBLE);
  const hiddenCount = anime.relations.length - INITIAL_VISIBLE;

  const handleNavigation = (relationType: string, id: number) => {
    if (relationType === "MANGA") {
      toast.warning("Manga are not available... yet!");
    }
    else navigate(`/anime/${id}`);    
  }

  return (
    <div className="flex flex-col gap-2 bg-muted border p-2 px-4 rounded-xs animate-in fade-in duration-300">
      <div className="font-semibold text-xs text-muted-foreground/50 uppercase tracking-widest">
        Relations <span className="text-muted-foreground/30 normal-case font-normal">({anime.relations.length})</span>
      </div>
      <div className={`grid grid-cols-1 gap-2 md:grid-cols-2`}>
        {visibleRelations.map((relation, index) => (
          <Card key={index} onClick={() => handleNavigation(relation.type, relation.id)} className="cursor-pointer bg-popover-accent/50 px-2 py-2 rounded-xs gap-1 flex-row items-center">
            <div className="w-14 shrink-0 rounded-xs overflow-hidden">
              <AspectRatio ratio={37 / 53} className="background-muted">
                <AnimeImage
                  url={relation.coverImage.large}
                  title={relation.title.english || relation.title.romaji || ""}
                />
              </AspectRatio>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <CardHeader className="px-2 gap-1">
                <CardDescription className="text-muted-foreground/60 text-xs uppercase tracking-wider">{relation.relationType}</CardDescription>
                <CardTitle className="text-sm text-primary/90 line-clamp-1">{relation.title.english || relation.title.romaji || relation.title.native}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs tracking-wider text-muted-foreground px-2">
                {displayFormat(relation.format)} • {displayAnimeStatus(relation.status)}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll((v) => !v)}
          className="self-center text-xs text-muted-foreground hover:text-muted-foreground gap-1.5 h-7"
        >
          {showAll ? (
            <>Show less <ChevronUp className="size-3" /></>
          ) : (
            <>Show {hiddenCount} more relation{hiddenCount !== 1 ? "s" : ""} <ChevronDown className="size-3" /></>
          )}
        </Button>
      )}
    </div>
  );
};
export default AnimeBodyRelations;