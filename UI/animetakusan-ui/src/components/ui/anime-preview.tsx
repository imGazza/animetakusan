import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";
import type { Anime } from "@/models/common/Anime";
import AnimeSectionHeader from "./anime-section-header";
import AnimeDisplay from "./anime-display";

interface AnimePreviewProps {
  title: string;
  filterName: string;
  data: Anime[];
}

const AnimePreview = ({ title, filterName, data }: AnimePreviewProps) => {
  return (
    <div className="flex flex-col gap-2 mb-4 md:mb-10">
      <AnimeSectionHeader title={title} filterName={filterName} />
      <AnimeDisplay className="lg:[&>*:nth-child(n+5)]:hidden xl:[&>*:nth-child(n+5)]:block xl:[&>*:nth-child(n+6)]:hidden 2xl:[&>*:nth-child(n+6)]:block">
        {
          data && data.length > 0 ?
            <AnimePreviewCards data={data} /> :
            <AnimePreviewSkeleton />
        }
      </AnimeDisplay>
    </div>
  )
}
export default AnimePreview;

const AnimePreviewCards = ({ data }: { data: Anime[] }) => {
  return (
    data.map((anime) => (
      <AnimeCard key={anime.id} anime={anime} />
    ))
  )
}

const AnimePreviewSkeleton = () => {
  return (
    <>
      {
        [...Array(6)].map(() => (
          <AnimeCardSkeleton key={crypto.randomUUID()} />
        ))
      }
    </>
  )
}