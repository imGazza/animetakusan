import AnimePreview from "@/components/ui/anime-preview"
import AnimeTopPreview from "@/components/ui/anime-top-preview"
import { useBrowseSectionQuery } from "./queries";
import { toast } from "sonner";
import Container from "@/components/ui/container";

const BrowseSection = () => {

  const { data: browseSection, isLoading, error } = useBrowseSectionQuery();

  if (error) {
    toast.error(error.message || "Error loading browse section. Please try again.");
  }

  return (
    <Container>
      <AnimePreview title="This Season" filterName="season" data={isLoading ? [] : browseSection?.season.data || []} />
      <AnimePreview title="Next Season" filterName="next-season" data={isLoading ? [] : browseSection?.nextSeason.data || []} />
      <AnimePreview title="Top Last Season" filterName="last-season" data={isLoading ? [] : browseSection?.topLastSeason.data || []} />
      <AnimeTopPreview title="Top All Time" filterName="top" data={isLoading ? [] : browseSection?.top.data || []} />
    </Container>
  )
}
export default BrowseSection;
