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

export const browseQueryKey = (filter: AnimeFilter, sort: string = "PopularityDesc") =>
  ['browse', filter, sort] as const;

export const useBrowseQuery = (filter: AnimeFilter, sort: string = "PopularityDesc") =>
  useInfiniteQuery({
    queryKey: browseQueryKey(filter, sort),
    queryFn: ({ pageParam }) => browseApis.browse({ filter: filter, page: { page: pageParam, perPage: 20 }, sort }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page.hasNextPage ? lastPage.page.currentPage + 1 : null,
    staleTime: Infinity
  });

  export const useSimpleBrowseQuery = (filter: AnimeFilter, sort: string = "PopularityDesc", enabled: boolean = true) =>
  useQuery({
    queryKey: browseQueryKey(filter, sort),
    queryFn: () => browseApis.browse({ filter: filter, page: { page: 1, perPage: 20 }, sort }),
    staleTime: Infinity,
    enabled
  });