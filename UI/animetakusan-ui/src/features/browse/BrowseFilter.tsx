import { useBrowseQuery } from "./queries";
import { toast } from "sonner";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeDisplay from "@/components/ui/anime-display";
import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";

const BrowseFilter = ({ filter }: { filter: AnimeFilter }) => {

  const { data: browseResult, isLoading, isFetching, fetchNextPage, hasNextPage, error } = useBrowseQuery(filter);

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
      <div className="flex justify-center mt-6">
        <button
          onClick={() => { if (hasNextPage) fetchNextPage(); }}
          disabled={!hasNextPage}
          className="px-6 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
        >
          Load More
        </button>
      </div>

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
