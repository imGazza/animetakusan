import { libraryApis } from "@/http/api/library";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const useLibraryQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ["library"],
    queryFn: libraryApis.userLibrary,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled,
  })

export const useLibraryQueryOptions = () =>
  queryOptions({
    queryKey: ["library"],
    queryFn: libraryApis.userLibrary,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });