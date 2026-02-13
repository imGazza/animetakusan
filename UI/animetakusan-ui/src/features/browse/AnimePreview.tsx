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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] grid-rows-2 gap-2.5 lg:gap-12 py-4 lg:[&>*:nth-child(n+5)]:hidden xl:[&>*:nth-child(n+5)]:block xl:[&>*:nth-child(n+6)]:hidden 2xl:[&>*:nth-child(n+6)]:block">
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