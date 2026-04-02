import { browseApis } from "@/http/api/browse";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { useQuery } from "@tanstack/react-query";

export const useBrowseSectionQuery = () =>
  useQuery({
    queryKey: ['browseSection'],
    queryFn: browseApis.browseSection,
    staleTime: Infinity,
    retry: 2
  });

export const useBrowseQuery = (filter: AnimeFilter) =>
  useQuery({
    queryKey: ['browse', filter],
    queryFn: () => browseApis.browse(filter),
    staleTime: Infinity,
    retry: 2
  });