import AnimeCard from "@/components/ui/anime-card";
import type { Anime } from "@/models/common/Anime";
import { mockAnime } from "./mock";

interface AnimePreviewProps {
  title: string;
  data: Anime[];
}

const AnimePreview = ({ title, data }: AnimePreviewProps) => {

  const displayData = data.length > 0 ? data : mockAnime;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-md font-medium text-muted-foreground tracking-wider">
        {title}
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 lg:gap-12 py-4">
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[1]} />
        <AnimeCard anime={displayData[2]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[1]} />
        <AnimeCard anime={displayData[2]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[1]} />
        <AnimeCard anime={displayData[2]} />
        <AnimeCard anime={displayData[0]} />
        <AnimeCard anime={displayData[1]} />
        <AnimeCard anime={displayData[2]} />
      </div>
    </div>
  )
}
export default AnimePreview;