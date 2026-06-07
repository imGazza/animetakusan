import { animeApis } from "@/http/api/anime";
import type { BrowseSection } from "@/models/browse/BrowseSection";
import type { MediaListEntry } from "@/models/common/Anime";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import type { AnimePage } from "@/models/common/AnimePage";
import { useMutation, type InfiniteData, type MutationFunctionContext } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAnimeEntryMutation = () =>
  useMutation({
    mutationFn: (animeEntry: AnimeEntryUpsert) => animeApis.animeEntryUpsert(animeEntry),
    onMutate: async (parameterEntry, context) => {
      console.log("entered onmutate: ", parameterEntry);

      // Cancel all eventual outgoing refetches
      await context.client.cancelQueries({ queryKey: ['anime', parameterEntry.mediaId] });

      const oldAnimeDetail = optimisticallyUpdateAnimeDetail(parameterEntry, context);
      const oldBrowseSection = optimisticallyUpdateBrowseSection(parameterEntry, context);
      const oldBrowse = optimisticallyUpdateBrowse(parameterEntry, context);

      // This goes in onMutateResult in the onError callback
      return { oldAnimeDetail, oldBrowseSection, oldBrowse };
    },
    onSuccess: (updatedEntry, parameterEntry, _, context) => {
      console.log("entered on success")
      updateAnimeDetail(parameterEntry, updatedEntry, context);
      console.log("updated detail on success")
      updateBrowseSection(parameterEntry, updatedEntry, context);
      console.log("updated browse section on success")
      updateBrowse(parameterEntry, updatedEntry, context);
      console.log("updated browse on success")

      toast.success("Entry updated successfully");
    },
    onError: (_, parameterEntry, onMutateResult, context) => {
      if (onMutateResult?.oldAnimeDetail) {
        context.client.setQueryData(['anime', parameterEntry.mediaId], onMutateResult?.oldAnimeDetail);
      }

      if (onMutateResult?.oldBrowseSection) {
        context.client.setQueryData(['browseSection'], onMutateResult?.oldBrowseSection);
      }

      if (onMutateResult?.oldBrowse && onMutateResult.oldBrowse.length > 0) {
        context.client.setQueriesData({ queryKey: ['browse'] }, onMutateResult?.oldBrowse);
      }
    }
  });

const optimisticallyUpdateAnimeDetail = (parameterEntry: AnimeEntryUpsert, context: MutationFunctionContext): AnimeDetail | undefined => {
  const oldAnimeDetail = context.client.getQueryData<AnimeDetail>(['anime', parameterEntry.mediaId]);
  if (!oldAnimeDetail) return;

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

const optimisticallyUpdateBrowseSection = (parameterEntry: AnimeEntryUpsert, context: MutationFunctionContext) => {
  const oldBrowseSection = context.client.getQueryData<BrowseSection>(['browseSection']);
  if (!oldBrowseSection) return;

  const updatePage = (page: AnimePage) => ({
    ...page,
    data: page.data.map(anime => anime.id === parameterEntry.mediaId ? {
      ...anime,
      mediaListEntry: {
        createdAt: anime.mediaListEntry?.createdAt ?? Math.floor(Date.now() / 1000), // Now in Unix
        status: parameterEntry.status ?? anime.mediaListEntry?.status ?? null,
        progress: parameterEntry.progress ?? anime.mediaListEntry?.progress ?? 0,
        startedAt: parameterEntry.startedAt ?? anime.mediaListEntry?.startedAt ?? null,
        completedAt: parameterEntry.completedAt ?? anime.mediaListEntry?.completedAt ?? null,
        score: parameterEntry.score ?? anime.mediaListEntry?.score ?? 0,
      }
    } : anime)
  });

  context.client.setQueryData(['browseSection'], (oldBrowseSection: BrowseSection) => ({
    season: updatePage(oldBrowseSection.season),
    nextSeason: updatePage(oldBrowseSection.nextSeason),
    topLastSeason: updatePage(oldBrowseSection.topLastSeason),
    top: updatePage(oldBrowseSection.top),
  }));

  console.log("exited opt browseSection: ", parameterEntry);


  return oldBrowseSection;
}

const optimisticallyUpdateBrowse = (parameterEntry: AnimeEntryUpsert, context: MutationFunctionContext) => {
  const oldBrowse = context.client.getQueriesData({ queryKey: ['browse'] });
  if (!oldBrowse || oldBrowse.length === 0) return;

  context.client.setQueriesData({ queryKey: ['browse'] }, (oldBrowse: InfiniteData<AnimePage>) => (
    oldBrowse.pages ?
      {
        ...oldBrowse,
        pages: oldBrowse.pages.map(page => ({
          ...page,
          data: page.data.map(anime => anime.id === parameterEntry.mediaId ? {
            ...anime,
            mediaListEntry: {
              createdAt: anime.mediaListEntry?.createdAt ?? Math.floor(Date.now() / 1000), // Now in Unix
              status: parameterEntry.status ?? anime.mediaListEntry?.status ?? null,
              progress: parameterEntry.progress ?? anime.mediaListEntry?.progress ?? 0,
              startedAt: parameterEntry.startedAt ?? anime.mediaListEntry?.startedAt ?? null,
              completedAt: parameterEntry.completedAt ?? anime.mediaListEntry?.completedAt ?? null,
              score: parameterEntry.score ?? anime.mediaListEntry?.score ?? 0,
            }
          } : anime)
        }))
      } : oldBrowse));

  return oldBrowse;
}

const updateAnimeDetail = (parameterEntry: AnimeEntryUpsert, updatedEntry: MediaListEntry, context: MutationFunctionContext) => {
  //Update the cache with the response from the server
  context.client.setQueryData(['anime', parameterEntry.mediaId], (oldAnime: AnimeDetail | undefined) =>
    oldAnime ?
      {
        ...oldAnime,
        mediaListEntry: updatedEntry
      } : oldAnime);
}

const updateBrowseSection = (parameterEntry: AnimeEntryUpsert, updatedEntry: MediaListEntry, context: MutationFunctionContext) => {
  const updatePage = (page: AnimePage) => {
    console.log("updating page: ", page); ({
      ...page,
      data: page.data.map(anime => anime.id === parameterEntry.mediaId ? {
        ...anime,
        mediaListEntry: updatedEntry
      } : anime)
    })
  };

  context.client.setQueryData(['browseSection'], (oldBrowseSection: BrowseSection) => (
    oldBrowseSection ? {
      season: updatePage(oldBrowseSection.season),
      nextSeason: updatePage(oldBrowseSection.nextSeason),
      topLastSeason: updatePage(oldBrowseSection.topLastSeason),
      top: updatePage(oldBrowseSection.top),
    } : oldBrowseSection));
}

const updateBrowse = (parameterEntry: AnimeEntryUpsert, updatedEntry: MediaListEntry, context: MutationFunctionContext) => {
  context.client.setQueriesData({ queryKey: ['browse'] }, (oldBrowse: InfiniteData<AnimePage>) => (
    oldBrowse ? {
      ...oldBrowse,
      pages: oldBrowse.pages.map(page => ({
        ...page,
        data: page.data.map(anime => anime.id === parameterEntry.mediaId ? {
          ...anime,
          mediaListEntry: updatedEntry
        } : anime)
      }))
    } : oldBrowse));
}
