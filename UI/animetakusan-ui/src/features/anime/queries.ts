import { animeApis } from "@/http/api/anime";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAnimeDetailQuery = (id: number) =>
  useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApis.animeDetail(id),
    staleTime: Infinity,
  });

export const useAnimeEntryMutation = () =>
  useMutation({
    mutationFn: (animeEntry: AnimeEntryUpsert) => animeApis.animeEntryUpsert(animeEntry),
    onMutate: async (parameterEntry, context) => {
      // Cancel all eventual outgoing refetches
      await context.client.cancelQueries({ queryKey: ['anime', parameterEntry.mediaId] });

      // Save the current data
      const oldAnime = context.client.getQueryData<AnimeDetail>(['anime', parameterEntry.mediaId]);

      // Optimistically update the entry data with the new entry
      context.client.setQueryData(['anime', parameterEntry.mediaId], (oldAnime: AnimeDetail | undefined) => 
        oldAnime ?
        {
          ...oldAnime,
          mediaListEntry: {
            createdAt: oldAnime.mediaListEntry?.createdAt ?? Math.floor(Date.now() / 1000), // Now in Unix
            status: parameterEntry.status ?? oldAnime.mediaListEntry?.status ?? null,
            progress: parameterEntry.progress ?? oldAnime.mediaListEntry?.progress ?? 0,
            startedAt: parameterEntry.startedAt ?? oldAnime.mediaListEntry?.startedAt ?? null,
            completedAt: parameterEntry.completedAt ?? oldAnime.mediaListEntry?.completedAt ?? null,
            score: parameterEntry.score ?? oldAnime.mediaListEntry?.score ?? 0,
          }
        } : oldAnime
      );

      // This goes in onMutateResult in the onError callback
      return { oldAnime };
    },
    onSuccess: (updatedEntry, parameterEntry, _, context) => {      
      //Update the cache with the response from the server
      context.client.setQueryData(['anime', parameterEntry.mediaId], (oldAnime: AnimeDetail | undefined) => 
        oldAnime ?
        {
          ...oldAnime,
          mediaListEntry: updatedEntry
        } : oldAnime);

      toast.success("Entry updated successfully");
    },
    onError: (_, parameterEntry, onMutateResult, context) => {
      context.client.setQueryData(['anime', parameterEntry.mediaId], onMutateResult?.oldAnime);
    }
  });