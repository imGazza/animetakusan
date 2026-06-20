import AnimePreview from "@/components/ui/anime-preview"
import AnimeTopPreview from "@/components/ui/anime-top-preview"
import { useBrowseSectionQuery } from "./queries";
import { toast } from "sonner";
import useDeferredRendering from "@/hooks/useDeferredRendering";

const BrowseSection = () => {

  const { data: browseSection, isLoading, error } = useBrowseSectionQuery();

  const isReady = useDeferredRendering(browseSection);

  if (error) {
    toast.error(error.message || "Error loading browse section. Please try again.");
  }

  return (
    <div className="mt-4 md:mt-10">
      <AnimePreview title="This Season" filterName="season" data={isLoading || !isReady ? [] : browseSection?.season.data || []} />
      <AnimePreview title="Next Season" filterName="next-season" data={isLoading || !isReady ? [] : browseSection?.nextSeason.data || []} />
      <AnimePreview title="Top Last Season" filterName="last-season" data={isLoading || !isReady ? [] : browseSection?.topLastSeason.data || []} />
      <AnimeTopPreview title="Top All Time" filterName="top" data={isLoading || !isReady ? [] : browseSection?.top.data || []} />
    </div>
  )
}
export default BrowseSection;
