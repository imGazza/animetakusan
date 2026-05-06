import AnimeBodyProduction from "@/components/ui/anime-body-production";
import AnimeBodyQuickInfo from "@/components/ui/anime-body-quickinfo";
import AnimeBodySynopsis from "@/components/ui/anime-body-synopsis";
import AnimeBodyTabs from "@/components/ui/anime-body-tabs";
import type { AnimeDetail } from "@/models/common/AnimeDetail";


const AnimeBody = ({ anime }: { anime: AnimeDetail }) => { 

  return (
    <>
      <div className="flex flex-col gap-4">
        <AnimeBodyQuickInfo anime={anime} />
        <AnimeBodyProduction anime={anime} />
        <AnimeBodySynopsis description={anime.description} />
        <AnimeBodyTabs anime={anime} />
      </div>
    </>
  );
}
export default AnimeBody;