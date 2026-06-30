import {  useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useBrowseQuery } from "./queries";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeDisplay from "@/components/ui/anime-display";
import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";
import useDeferredRendering from "@/hooks/useDeferredRendering";
import { Button } from "@/components/ui/button";

const BrowseFilter = ({ filter, sort }: { filter: AnimeFilter, sort?: string }) => {
  const { data: browseResult, isLoading, isFetching, fetchNextPage, hasNextPage, isError, refetch } = useBrowseQuery(filter, sort);

  // ref attached to placeholder div at the end
  const { ref, inView } = useInView();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const isReady = useDeferredRendering(browseResult);
  useEffect(() => {
    // Pause auto-paging on error so we don't tight-loop the failing request.
    if (isReady && inView && hasNextPage && !isFetching && !isError) {
      fetchNextPage();
    }
  }, [browseResult, isReady, inView, hasNextPage, isFetching, isError, fetchNextPage]);

  // Memoed anime cards to avoid unnecessary re-renders when fetching next page
  const animeCards = useMemo(() =>
    browseResult?.pages.flatMap((page) =>
      page.data.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))
    ),
    [browseResult?.pages]
  );

  const hasResults = animeCards && animeCards.length > 0;

  return (
    <div className="mt-6">
      <AnimeDisplay>
        {
          // Initial 20 items skeleton while loading, then show results or "No results"
          isLoading || !isReady ?
            <BrowseFilterSkeleton /> :
            hasResults ? (
              animeCards
            ) : !isError ? (
              <div className="col-span-full text-center">No results found.</div>
            ) : null
        }
        {
          // Additional 20 items skeleton while fetching next page
          isFetching && !isLoading && (
            <BrowseFilterSkeleton />
          )
        }
      </AnimeDisplay>
      {
        // Inline error affordance — keeps already-loaded pages on screen.
        isError && !isFetching && (
          <div className="col-span-full mt-6 flex flex-col items-center gap-3 text-center">
            <p className="text-muted-foreground">
              {hasResults ? "Couldn't load more results." : "Couldn't load results."}
            </p>
            <Button
              variant="outline"
              onClick={() => (hasResults ? fetchNextPage() : refetch())}
            >
              Retry
            </Button>
          </div>
        )
      }
      <div ref={ref} className="h-1" />
    </div>
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
