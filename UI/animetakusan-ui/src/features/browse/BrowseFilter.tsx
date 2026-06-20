import {  useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useBrowseQuery } from "./queries";
import { toast } from "sonner";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeDisplay from "@/components/ui/anime-display";
import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";
import useDeferredRendering from "@/hooks/useDeferredRendering";

const BrowseFilter = ({ filter, sort }: { filter: AnimeFilter, sort?: string }) => {
  const { data: browseResult, isLoading, isFetching, fetchNextPage, hasNextPage, error } = useBrowseQuery(filter, sort);

  // ref attached to placeholder div at the end
  const { ref, inView } = useInView();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const isReady = useDeferredRendering(browseResult);
  useEffect(() => {    
    if (isReady && inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [browseResult, isReady, inView, hasNextPage, isFetching, fetchNextPage]);  

  // Memoed anime cards to avoid unnecessary re-renders when fetching next page
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
    <div className="mt-6">
      <AnimeDisplay>
        {
          // Initial 20 items skeleton while loading, then show results or "No results"
          isLoading || !isReady ?
            <BrowseFilterSkeleton /> :
            animeCards && animeCards.length > 0 ? (
              animeCards
            ) : (
              <div className="col-span-full text-center">No results found.</div>
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
