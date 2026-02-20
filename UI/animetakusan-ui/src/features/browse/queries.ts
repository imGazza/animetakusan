import { browseApis } from "@/http/api/browse";
import { useQuery } from "@tanstack/react-query";

export const useBrowseQuery = () =>
  useQuery({
    queryKey: ['browse'],
    queryFn: browseApis.browse,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2
  });
