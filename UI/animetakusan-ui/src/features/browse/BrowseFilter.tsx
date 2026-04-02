import { useBrowseQuery } from "./queries";
import { toast } from "sonner";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeDisplay from "@/components/ui/anime-display";
import AnimeCard, { AnimeCardSkeleton } from "@/components/ui/anime-card";

const BrowseFilter = ({ filter }: { filter: AnimeFilter }) => {

  const { data: browseResult, isLoading, error } = useBrowseQuery(filter);

  if (error) {
    toast.error(error.message || "Error loading browse section. Please try again.");
  }

  return (
    <div className="container mx-auto px-2.5 md:px-6 m-inline py-6">
      <AnimeDisplay>
        {
          isLoading ?
            <BrowseFilterSkeleton /> :
            browseResult && browseResult.data ?
            browseResult.data.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            )) : (
              <div>No results found.</div>
            )
        }      
      </AnimeDisplay>
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
