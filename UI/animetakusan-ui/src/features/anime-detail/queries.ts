import { animeApis } from "@/http/api/anime";
import type { EntryDeleted } from "@/models/common/EntryDeleted";
import type { ToggleFavourite } from "@/models/common/ToggleFavourite";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  applyAnimeTransform,
  cancelAnimeQueries,
  invalidateLibrary,
  restoreAnimeCaches,
} from "../anime-cache";

export const useAnimeDetailQuery = (id: number) =>
  useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApis.animeDetail(id),
    staleTime: Infinity,
  });

export const useDeleteAnimeEntry = (animeId: number, malId: number) =>
  useMutation({
    mutationFn: (mediaListEntryId: number) => animeApis.deleteAnimeEntry({ mediaListEntryId, malId }),
    onMutate: async (_, context) => {
      await cancelAnimeQueries(context.client, animeId);

      // Optimistically clear the entry; returned snapshot rolls back on error.
      return applyAnimeTransform(context.client, animeId, anime => ({ ...anime, mediaListEntry: null }));
    },
    onSuccess: (deleteResult: EntryDeleted, _, __, context) => {
      if (!deleteResult.deleted) return;
      applyAnimeTransform(context.client, animeId, anime => ({ ...anime, mediaListEntry: null }));
    },
    onError: (_, __, snapshot, context) => {
      restoreAnimeCaches(context.client, animeId, snapshot);
    },
    // Library is grouped by list/status — refetch it instead of patching in place.
    onSettled: (_, __, ___, ____, context) => invalidateLibrary(context.client),
  });

export const useToggleFavouriteAnime = (animeId: number) =>
  useMutation({
    mutationFn: () => animeApis.toggleFavourite(animeId),
    onMutate: async (_, context) => {
      await cancelAnimeQueries(context.client, animeId);

      // Optimistically flip the flag; returned snapshot rolls back on error.
      return applyAnimeTransform(context.client, animeId, anime => ({ ...anime, isFavourite: !anime.isFavourite }));
    },
    onSuccess: (result: ToggleFavourite, _, __, context) => {
      applyAnimeTransform(context.client, animeId, anime => ({ ...anime, isFavourite: result.isMarkedAsFavourite }));
    },
    onError: (_, __, snapshot, context) => {
      restoreAnimeCaches(context.client, animeId, snapshot);
    },
    onSettled: (_, __, ___, ____, context) => invalidateLibrary(context.client),
  });
