import { animeApis } from "@/http/api/anime";
import type { BrowseSection } from "@/models/browse/BrowseSection";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimePage } from "@/models/common/AnimePage";
import type { EntryDeleted } from "@/models/common/EntryDeleted";
import { useMutation, useQuery, type InfiniteData, type MutationFunctionContext } from "@tanstack/react-query";

export const useAnimeDetailQuery = (id: number) =>
  useQuery({
    queryKey: ['anime', id],
    queryFn: () => animeApis.animeDetail(id),
    staleTime: Infinity,
  });

export const useDeleteAnimeEntry = (animeId: number) => 
  useMutation({
    mutationFn: (animeEntryId: number) => animeApis.deleteAnimeEntry(animeEntryId),
    onMutate: async (_, context) => {

      // Cancel all eventual outgoing refetches
      await context.client.cancelQueries({ queryKey: ['anime', animeId] });
      await context.client.cancelQueries({ queryKey: ['browseSection'] });
      await context.client.cancelQueries({ queryKey: ['browse'] });

      const oldAnimeDetail = optimisticallyUpdateAnimeDetail(animeId, context);
      const oldBrowseSection = optimisticallyUpdateBrowseSection(animeId, context);
      const oldBrowse = optimisticallyUpdateBrowse(animeId, context);

      // This goes in onMutateResult in the onError callback
      return { oldAnimeDetail, oldBrowseSection, oldBrowse };
    },
    onSuccess: (deleteResult: EntryDeleted, _, __, context) => {

      //Update the cache with the response from the server
      updateAnimeDetail(animeId, deleteResult.deleted, context);
      updateBrowseSection(animeId, deleteResult.deleted, context);
      updateBrowse(animeId, deleteResult.deleted, context);
    },
    onError: (_, __, onMutateResult, context) => {
      if (onMutateResult?.oldAnimeDetail) {
        context.client.setQueryData(['anime', animeId], onMutateResult?.oldAnimeDetail);
      }

      if (onMutateResult?.oldBrowseSection) {
        context.client.setQueryData(['browseSection'], onMutateResult?.oldBrowseSection);
      }

      if (onMutateResult?.oldBrowse && onMutateResult.oldBrowse.length > 0) {
        context.client.setQueriesData({ queryKey: ['browse'] }, onMutateResult?.oldBrowse);
      }
    }
  });

const optimisticallyUpdateAnimeDetail = (animeId: number, context: MutationFunctionContext): AnimeDetail | undefined => {
  const oldAnimeDetail = context.client.getQueryData<AnimeDetail>(['anime', animeId]);
  if (!oldAnimeDetail) return;

  context.client.setQueryData(['anime', animeId], (oldAnime: AnimeDetail | undefined) =>
    oldAnime ?
      {
        ...oldAnime,
        mediaListEntry: null
      } : oldAnime
  );

  return oldAnimeDetail;
}

const optimisticallyUpdateBrowseSection = (animeId: number, context: MutationFunctionContext) => {
  const oldBrowseSection = context.client.getQueryData<BrowseSection>(['browseSection']);
  if (!oldBrowseSection) return;

  const updatePage = (page: AnimePage) => ({
    ...page,
    data: page.data.map(anime => anime.id === animeId ? {
      ...anime,
      mediaListEntry: null
    } : anime)
  });

  context.client.setQueryData(['browseSection'], (oldBrowseSection: BrowseSection) => ({
    season: updatePage(oldBrowseSection.season),
    nextSeason: updatePage(oldBrowseSection.nextSeason),
    topLastSeason: updatePage(oldBrowseSection.topLastSeason),
    top: updatePage(oldBrowseSection.top),
  }));

  return oldBrowseSection;
}

const optimisticallyUpdateBrowse = (animeId: number, context: MutationFunctionContext) => {
  const oldBrowse = context.client.getQueriesData({ queryKey: ['browse'] });
  if (!oldBrowse || oldBrowse.length === 0) return;

  context.client.setQueriesData({ queryKey: ['browse'] }, (oldBrowse: InfiniteData<AnimePage>) => (
    oldBrowse.pages ?
      {
        ...oldBrowse,
        pages: oldBrowse.pages.map(page => ({
          ...page,
          data: page.data.map(anime => anime.id === animeId ? {
            ...anime,
            mediaListEntry: null
          } : anime)
        }))
      } : oldBrowse));

  return oldBrowse;
}

const updateAnimeDetail = (animeId: number, deleted: boolean, context: MutationFunctionContext) => {
  context.client.setQueryData(['anime', animeId], (oldAnime: AnimeDetail | undefined) =>
    oldAnime && deleted ?
      {
        ...oldAnime,
        mediaListEntry: null
      } : oldAnime);
}

const updateBrowseSection = (animeId: number, deleted: boolean, context: MutationFunctionContext) => {
  const updatePage = (page: AnimePage) => ({
    ...page,
    data: page.data.map(anime => anime.id === animeId ? {
      ...anime,
      mediaListEntry: null
    } : anime)
  });

  context.client.setQueryData(['browseSection'], (oldBrowseSection: BrowseSection) => (
    oldBrowseSection && deleted ? {
      season: updatePage(oldBrowseSection.season),
      nextSeason: updatePage(oldBrowseSection.nextSeason),
      topLastSeason: updatePage(oldBrowseSection.topLastSeason),
      top: updatePage(oldBrowseSection.top),
    } : oldBrowseSection));
}

const updateBrowse = (animeId: number, deleted: boolean, context: MutationFunctionContext) => {
  context.client.setQueriesData({ queryKey: ['browse'] }, (oldBrowse: InfiniteData<AnimePage>) => (
    oldBrowse && deleted ? {
      ...oldBrowse,
      pages: oldBrowse.pages.map(page => ({
        ...page,
        data: page.data.map(anime => anime.id === animeId ? {
          ...anime,
          mediaListEntry: null
        } : anime)
      }))
    } : oldBrowse));
}
