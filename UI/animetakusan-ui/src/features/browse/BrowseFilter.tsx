import { startTransition, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useBrowseQuery } from "./queries";
import { toast } from "sonner";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeDisplay from "@/components/ui/anime-display";
import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";
import Container from "@/components/ui/container";

const BrowseFilter = ({ filter, sort }: { filter: AnimeFilter, sort?: string }) => {
  
  const { data: browseResult, isLoading, isFetching, fetchNextPage, hasNextPage, error } = useBrowseQuery(filter, sort);

  // ref attached to placeholder div at the end
  const { ref, inView } = useInView();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // isReady starts false on every mount (filter changes trigger remount via the key in Browse.tsx).
  // startTransition defers the card tree render so skeletons paint first, even on cache hits.
  // Pagination is gated on isReady so the sentinel can't trigger fetchNextPage
  // while skeletons are still displayed.
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!isReady && browseResult) {
      startTransition(() => setIsReady(true));
      return;
    }
    if (isReady && inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [browseResult, isReady, inView, hasNextPage, isFetching, fetchNextPage]);  

  const animeCards = useMemo(() =>
    browseResult?.pages.flatMap((page) =>
      page.data.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))
    ),
    [browseResult?.pages]
  );

  if (error) {
    toast.error(error.message || "Error loading. Please try again.");
  }

  return (
    <Container>
      <AnimeDisplay>
        {
          // Initial 20 items skeleton while loading, then show results or "No results"
          isLoading || !isReady ?
            <BrowseFilterSkeleton /> :
            animeCards && animeCards.length > 0 ? (
              animeCards
            ) : (
              <div>No results found.</div>
            )
        }
        {
          // Additional 20 items skeleton while fetching next page
          isFetching && !isLoading && (
            <BrowseFilterSkeleton />
          )
        }     
      </AnimeDisplay>
      <div ref={ref} className="h-1" /> 
    </Container>
  )
}
export default BrowseFilter;

const BrowseFilterSkeleton = () => {
  return (
    <>
      {
        [...Array(20)].map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))
      }
    </>
  )
}
