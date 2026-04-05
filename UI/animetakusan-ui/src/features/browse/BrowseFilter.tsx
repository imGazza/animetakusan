import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useBrowseQuery } from "./queries";
import { toast } from "sonner";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeDisplay from "@/components/ui/anime-display";
import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";

const BrowseFilter = ({ filter, sort }: { filter: AnimeFilter, sort?: string }) => {

  //TODO: Hide adult content from backend

  const { data: browseResult, isLoading, isFetching, fetchNextPage, hasNextPage, error } = useBrowseQuery(filter, sort);
  const { ref, inView } = useInView();
  const isMounted = useRef(false);

  // Scroll to top 
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // First time the fetch is skipped to avoid fetching the next page immediately on load if the scroll bar is not at the top
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (error) {
    toast.error(error.message || "Error loading. Please try again.");
  }

  return (
    <div className="container mx-auto px-2.5 md:px-6 m-inline py-6">
      <AnimeDisplay>
        {
          // Initial 20 items skeleton while loading, then show results or "No results"
          isLoading ?
            <BrowseFilterSkeleton /> :
            browseResult && browseResult.pages ? (
              browseResult.pages.flatMap((page) =>
                page.data.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))
              )
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
    </div>
  )
}
export default BrowseFilter;

const BrowseFilterSkeleton = () => {
  return (
    <>
      {
        [...Array(20)].map(() => (
          <AnimeCardSkeleton key={crypto.randomUUID()} />
        ))
      }
    </>
  )
}
