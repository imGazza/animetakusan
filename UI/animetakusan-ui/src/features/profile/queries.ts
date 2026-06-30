import { profileApis } from "@/http/api/profile";
import { useQuery } from "@tanstack/react-query";

export const useViewerInfoQuery = () =>
  useQuery({
    queryKey: ['viewerInfo'],
    queryFn: profileApis.getViewer,
    staleTime: Infinity
  });