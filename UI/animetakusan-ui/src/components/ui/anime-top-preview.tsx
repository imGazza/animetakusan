import type { Anime } from "@/models/common/Anime";
import AnimeTopCard from "./anime-top-card";

interface AnimeTopPreviewProps {
  title: string;
  data: Anime[];
}

const AnimeTopPreview = ({ title, data }: AnimeTopPreviewProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-md font-medium text-muted-foreground tracking-wider">
        {title}
      </div>
      <div className="flex flex-col gap-2 py-2 md:py-4">
        {data.map((anime, index) => (
          <AnimeTopCard key={anime.id} anime={anime} index={index + 1} />
        ))}
      </div>
    </div>    
  );
}
export default AnimeTopPreview;