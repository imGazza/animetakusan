import { animeApis } from "@/http/api/anime";
import type { BrowseSection } from "@/models/browse/BrowseSection";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimePage } from "@/models/common/AnimePage";
import type { EntryDeleted } from "@/models/common/EntryDeleted";
import type { ToggleFavourite } from "@/models/common/ToggleFavourite";
import { useMutation, useQuery, type InfiniteData, type MutationFunctionContext } from "@tanstack/react-query";

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

      // Cancel all eventual outgoing refetches
      await context.client.cancelQueries({ queryKey: ['anime', animeId] });
      await context.client.cancelQueries({ queryKey: ['browseSection'] });
      await context.client.cancelQueries({ queryKey: ['browse'] });

      const oldAnimeDetail = optimisticallyUpdateAnimeDetailDelete(animeId, context);
      const oldBrowseSection = optimisticallyUpdateBrowseSectionDelete(animeId, context);
      const oldBrowse = optimisticallyUpdateBrowseDelete(animeId, context);

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

const optimisticallyUpdateAnimeDetailDelete = (animeId: number, context: MutationFunctionContext): AnimeDetail | undefined => {
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

const optimisticallyUpdateBrowseSectionDelete = (animeId: number, context: MutationFunctionContext) => {
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

const optimisticallyUpdateBrowseDelete = (animeId: number, context: MutationFunctionContext) => {
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

export const useToggleFavouriteAnime = (animeId: number) => 
  useMutation({
    mutationFn: () => animeApis.toggleFavourite(animeId),
    onMutate: async (_, context) => {

      // Cancel all eventual outgoing refetches
      await context.client.cancelQueries({ queryKey: ['anime', animeId] });
      await context.client.cancelQueries({ queryKey: ['browseSection'] });
      await context.client.cancelQueries({ queryKey: ['browse'] });

      const oldAnimeDetail = optimisticallyUpdateAnimeDetailFavourite(animeId, context);
      const oldBrowseSection = optimisticallyUpdateBrowseSectionFavourite(animeId, context);
      const oldBrowse = optimisticallyUpdateBrowseFavourite(animeId, context);

      // This goes in onMutateResult in the onError callback
      return { oldAnimeDetail, oldBrowseSection, oldBrowse };
    },
    onSuccess: (result, _, __, context) => {

      console.log(result);
      //Update the cache with the response from the server
      updateAnimeDetailFavourite(animeId, result, context);
      updateBrowseSectionFavourite(animeId,result, context);
      updateBrowseFavourite(animeId, result, context);
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
  })

const optimisticallyUpdateAnimeDetailFavourite = (animeId: number, context: MutationFunctionContext) => {
      const oldAnime = context.client.getQueryData<AnimeDetail>(['anime', animeId]);
      if (!oldAnime) return;

      context.client.setQueryData(['anime', animeId], (oldAnime: AnimeDetail | undefined) =>
        oldAnime ?
          {
            ...oldAnime,
            isFavourite: !oldAnime.isFavourite
          } : oldAnime
      );
}

const optimisticallyUpdateBrowseSectionFavourite = (animeId: number, context: MutationFunctionContext) => {
  const oldBrowseSection = context.client.getQueryData<BrowseSection>(['browseSection']);
  if (!oldBrowseSection) return;

  const updatePage = (page: AnimePage) => ({
    ...page,
    data: page.data.map(anime => anime.id === animeId ? {
      ...anime,
      isFavourite: !anime.isFavourite
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

const optimisticallyUpdateBrowseFavourite = (animeId: number, context: MutationFunctionContext) => {
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
            isFavourite: !anime.isFavourite
          } : anime)
        }))
      } : oldBrowse));

  return oldBrowse;
}

const updateAnimeDetailFavourite = (animeId: number, result: ToggleFavourite, context: MutationFunctionContext) => {
  context.client.setQueryData(['anime', animeId], (oldAnime: AnimeDetail | undefined) =>
    oldAnime ?
      {
        ...oldAnime,
        isFavourite: result.isMarkedAsFavourite
      } : oldAnime
  );
}

const updateBrowseSectionFavourite = (animeId: number, result: ToggleFavourite, context: MutationFunctionContext) => {
  const updatePage = (page: AnimePage) => ({
    ...page,
    data: page.data.map(anime => anime.id === animeId ? {
      ...anime,
      isFavourite: result.isMarkedAsFavourite
    } : anime)
  });

  context.client.setQueryData(['browseSection'], (oldBrowseSection: BrowseSection) => (
    oldBrowseSection ? {
      season: updatePage(oldBrowseSection.season),
      nextSeason: updatePage(oldBrowseSection.nextSeason),
      topLastSeason: updatePage(oldBrowseSection.topLastSeason),
      top: updatePage(oldBrowseSection.top),
    } : oldBrowseSection));
}

const updateBrowseFavourite = (animeId: number, result: ToggleFavourite, context: MutationFunctionContext) => {
  context.client.setQueriesData({ queryKey: ['browse'] }, (oldBrowse: InfiniteData<AnimePage>) => (
    oldBrowse ? {
      ...oldBrowse,
      pages: oldBrowse.pages.map(page => ({
        ...page,
        data: page.data.map(anime => anime.id === animeId ? {
          ...anime,
          isFavourite: result.isMarkedAsFavourite
        } : anime)
      }))
    } : oldBrowse));
}

