import { animeApis } from "@/http/api/anime";
import type { Anime, MediaListEntry } from "@/models/common/Anime";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import { useMutation } from "@tanstack/react-query";
import {
  applyAnimeTransform,
  cancelAnimeQueries,
  invalidateLibrary,
  restoreAnimeCaches,
} from "./anime-cache";

// Builds the optimistic entry from the mutation input, keeping any existing values the input omits.
const optimisticEntry = (parameterEntry: AnimeEntryUpsert) => (anime: Anime): Anime => ({
  ...anime,
  mediaListEntry: {
    createdAt: anime.mediaListEntry?.createdAt ?? Math.floor(Date.now() / 1000), // Now in Unix
    id: anime.mediaListEntry?.id ?? -1, // Temp Id. Server response will update
    mediaId: parameterEntry.mediaId,
    status: parameterEntry.status ?? anime.mediaListEntry?.status ?? '',
    progress: parameterEntry.progress ?? anime.mediaListEntry?.progress ?? 0,
    startedAt: parameterEntry.startedAt ?? anime.mediaListEntry?.startedAt ?? null,
    completedAt: parameterEntry.completedAt ?? anime.mediaListEntry?.completedAt ?? null,
    score: parameterEntry.score ?? anime.mediaListEntry?.score ?? 0,
  },
});

export const useAnimeEntryMutation = () =>
  useMutation({
    mutationFn: (animeEntry: AnimeEntryUpsert) => animeApis.animeEntryUpsert(animeEntry),
    onMutate: async (parameterEntry, context) => {
      await cancelAnimeQueries(context.client, parameterEntry.mediaId);

      // Optimistically write the entry; returned snapshot rolls back on error.
      return applyAnimeTransform(context.client, parameterEntry.mediaId, optimisticEntry(parameterEntry));
    },
    onSuccess: (updatedEntry: MediaListEntry, parameterEntry, _, context) => {
      applyAnimeTransform(context.client, parameterEntry.mediaId, anime => ({ ...anime, mediaListEntry: updatedEntry }));
    },
    onError: (_, parameterEntry, snapshot, context) => {
      restoreAnimeCaches(context.client, parameterEntry.mediaId, snapshot);
    },    
    onSettled: (_, __, ___, ____, context) => invalidateLibrary(context.client),
  });
