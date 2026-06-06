import { animeApis } from "@/http/api/anime";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import { useMutation, type MutationFunctionContext } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAnimeEntryMutation = () =>
  useMutation({
    mutationFn: (animeEntry: AnimeEntryUpsert) => animeApis.animeEntryUpsert(animeEntry),
    onMutate: async (parameterEntry, context) => {
      // Cancel all eventual outgoing refetches
      await context.client.cancelQueries({ queryKey: ['anime', parameterEntry.mediaId] });

      const oldAnimeDetail = optmisticallyUpdateAnimeDetail(parameterEntry, context);
      // TODO: Do the same for browseSection
      // TODO: Do the same for browse

      // This goes in onMutateResult in the onError callback
      return { oldAnime: oldAnimeDetail };
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

const optmisticallyUpdateAnimeDetail = (parameterEntry: AnimeEntryUpsert, context: MutationFunctionContext): AnimeDetail | undefined => {
  const oldAnimeDetail = context.client.getQueryData<AnimeDetail>(['anime', parameterEntry.mediaId]);

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
  return oldAnimeDetail;
}