import { browseApis } from "@/http/api/browse";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useBrowseSectionQuery = () =>
  useQuery({
    queryKey: ['browseSection'],
    queryFn: browseApis.browseSection,
    staleTime: Infinity,
    retry: 2
  });
  
export const useBrowseQuery = (filter: AnimeFilter) =>
  useInfiniteQuery({
    queryKey: ['browse', filter],
    queryFn: ({ pageParam }) => browseApis.browse({ filter: filter, page: { page: pageParam, perPage: 20 } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page.hasNextPage ? lastPage.page.currentPage + 1 : null,
    staleTime: Infinity,
  });