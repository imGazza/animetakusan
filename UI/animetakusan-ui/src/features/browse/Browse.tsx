import { toast } from "sonner";
import AnimePreview from "../../components/ui/anime-preview";
import { useBrowseQuery } from "./queries";
import AnimeTopPreview from "@/components/ui/anime-top-preview";
import TokenManager from "@/lib/token-manager";

const Browse = () => {

  const { data: browseSection, isLoading, error } = useBrowseQuery();

  if(error){
    toast.error(error.message || "Error loading browse section. Please try again.");
  }
  //, { headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` } })}

  return (
    <div className="container mx-auto px-2.5 md:px-6 m-inline py-6">

      <button onClick={() => { window.location.href = "https://localhost:5016/anilist/auth"; }}>Connect AniList</button>


      <AnimePreview title="This Season" data={isLoading ? [] : browseSection?.season.data || []} />
      <AnimePreview title="Next Season" data={isLoading ? [] : browseSection?.nextSeason.data || []} />
      <AnimePreview title="Top Last Season" data={isLoading ? [] : browseSection?.topLastSeason.data || []} />
      <AnimeTopPreview title="Top All Time" data={isLoading ? [] : browseSection?.top.data || []} />
    </div>
  )
}
export default Browse;