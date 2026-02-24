import { toast } from "sonner";
import AnimePreview from "../../components/ui/anime-preview";
import { useBrowseQuery } from "./queries";
import AnimeTopPreview from "@/components/ui/anime-top-preview";

const Browse = () => {

  const { data: browseSection, error } = useBrowseQuery();

  if(error){
    toast.error(error.message || "Error loading browse section. Please try again.");
  }

  return (
    <div className="container mx-auto px-2.5 md:px-6 m-inline py-6">
      <AnimePreview title="This Season" data={browseSection?.season.data || []} />
      <AnimePreview title="Next Season" data={browseSection?.nextSeason.data || []} />
      <AnimePreview title="Top From Last Season" data={browseSection?.topLastSeason.data || []} />
      <AnimeTopPreview title="Top All Time" data={browseSection?.top.data || []} />
    </div>
  )
}
export default Browse;