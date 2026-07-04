import { profileApis } from "@/http/api/profile";
import { queryClient } from "@/lib/query-client";
import type { User } from "@/models/auth/User";
import { useQuery } from "@tanstack/react-query";

export const useViewerInfoQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ['viewerInfo'],
    queryFn: async () => {
      const viewerInfo = await profileApis.getViewer();

      queryClient.setQueryData(['user'], (userOld: User | undefined) =>
        userOld ? {
          ...userOld,
          profilePicture: viewerInfo.avatar ?? userOld.profilePicture,
          userName: viewerInfo.username ?? userOld.userName,
        } : userOld);

      return viewerInfo;
    },
    staleTime: Infinity,
    enabled
  });