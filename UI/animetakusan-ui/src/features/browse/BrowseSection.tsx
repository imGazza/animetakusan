import AnimePreview from "@/components/ui/anime-preview"
import AnimeTopPreview from "@/components/ui/anime-top-preview"
import { useBrowseSectionQuery } from "./queries";
import { toast } from "sonner";
import Container from "@/components/ui/container";
import { useState, useEffect, startTransition } from "react";

const BrowseSection = () => {

  const { data: browseSection, isLoading, error } = useBrowseSectionQuery();

  // isReady starts false on every mount.
  // startTransition defers the card tree render so skeletons paint first, even on cache hits.
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    console.log(isReady);
    if (!isReady && browseSection) {
      startTransition(() => setIsReady(true));
      return;
    }
  }, [browseSection, isReady]);

  if (error) {
    toast.error(error.message || "Error loading browse section. Please try again.");
  }

  return (
    <Container className="mt-4 md:mt-10">
      <AnimePreview title="This Season" filterName="season" data={isLoading || !isReady ? [] : browseSection?.season.data || []} />
      <AnimePreview title="Next Season" filterName="next-season" data={isLoading || !isReady ? [] : browseSection?.nextSeason.data || []} />
      <AnimePreview title="Top Last Season" filterName="last-season" data={isLoading || !isReady ? [] : browseSection?.topLastSeason.data || []} />
      <AnimeTopPreview title="Top All Time" filterName="top" data={isLoading || !isReady ? [] : browseSection?.top.data || []} />
    </Container>
  )
}
export default BrowseSection;
