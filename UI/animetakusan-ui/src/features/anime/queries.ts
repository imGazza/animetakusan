import { animeApis } from "@/http/api/anime";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAnimeDetailQuery = (id: number) =>
  useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApis.animeDetail(id),
    staleTime: Infinity,
  });

export const useAnimeEntryMutation = () =>
  useMutation({
    mutationFn: (animeEntry: AnimeEntryUpsert) => animeApis.animeEntryUpsert(animeEntry),
    scope: {
      id: 'AnimeEntryUpsert'
    },
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
            ...parameterEntry
          }
        } : oldAnime
      );

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
    },
    onError: (_, parameterEntry, onMutateResult, context) => {
      context.client.setQueryData(['anime', parameterEntry.mediaId], onMutateResult?.oldAnime);
    }
  });