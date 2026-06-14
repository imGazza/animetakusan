import { libraryApis } from "@/http/api/library";
import { useQuery } from "@tanstack/react-query";

export const useLibraryQuery = (userId: number | null) =>
  useQuery({
    queryKey: ["library", userId],
    queryFn: libraryApis.userLibrary,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    enabled: !!userId
  })