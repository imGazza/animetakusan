import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";
import type { Anime } from "@/models/common/Anime";

interface AnimePreviewProps {
  title: string;
  data: Anime[];
}

const AnimePreview = ({ title, data }: AnimePreviewProps) => {

  return (
    <div className="flex flex-col gap-2 mb-10">
      <div className="text-md font-medium text-muted-foreground tracking-wider">
        {title}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5 lg:gap-12 py-4 lg:[&>*:nth-child(n+5)]:hidden xl:[&>*:nth-child(n+5)]:block xl:[&>*:nth-child(n+6)]:hidden 2xl:[&>*:nth-child(n+6)]:block">
        {
          data && data.length > 0 ?
            <AnimePreviewCards data={data} /> :
            <AnimePreviewSkeleton />
        }
      </div>
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