import { profileApis } from "@/http/api/profile";
import { useQuery } from "@tanstack/react-query";

export const useViewerInfoQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ['viewerInfo'],
    queryFn: profileApis.getViewer,
    staleTime: Infinity,
    enabled
  });