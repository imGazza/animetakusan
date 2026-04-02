import type { Anime } from "@/models/common/Anime";
import AnimeTopCard, { AnimeTopCardSkeleton } from "./anime-top-card";
import AnimeSectionHeader from "./anime-section-header";

interface AnimeTopPreviewProps {
  title: string;
  filterName: string;
  data: Anime[];
}

const AnimeTopPreview = ({ title, filterName, data }: AnimeTopPreviewProps) => {
  return (
    <div className="flex flex-col gap-2">
      <AnimeSectionHeader title={title} filterName={filterName} />
      <div className="flex flex-col gap-2 py-2 md:py-4">        
        {
          data && data.length > 0 ?
            <AnimeTopPreviewCards data={data} /> :
            <AnimeTopPreviewSkeleton />
        }        
      </div>
    </div>    
  );
}
export default AnimeTopPreview;

const AnimeTopPreviewCards = ({ data }: { data: Anime[] }) => {
  return (
    data.map((anime, index) => (
      <AnimeTopCard key={anime.id} anime={anime} index={index + 1} />
    ))
  )
}

const AnimeTopPreviewSkeleton = () => {
  return (
    <>
      {
        [...Array(10)].map(() => (
          <AnimeTopCardSkeleton key={crypto.randomUUID()} />
        ))
      }
    </>
  );
}