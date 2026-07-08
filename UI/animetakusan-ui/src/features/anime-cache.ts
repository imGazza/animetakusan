import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import type { BrowseSection } from "@/models/browse/BrowseSection";
import type { Anime } from "@/models/common/Anime";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import type { AnimePage } from "@/models/common/AnimePage";

/**
 * A pure transform applied to the single anime that matches the mutation target.
 * Every anime-facing cache holds Anime objects (AnimeDetail extends Anime),
 * so one transform can be run across all of them.
 */
export type AnimeTransform = (anime: Anime) => Anime;

/** Snapshot used to rollback in case of errors in the mutation */
export interface AnimeCacheSnapshot {
  animeDetail?: AnimeDetail;
  browseSection?: BrowseSection;
  browse?: [QueryKey, unknown][];
}

const animeDetailKey = (animeId: number): QueryKey => ['anime', animeId];
const browseSectionKey: QueryKey = ['browseSection'];
const browseFilter = { queryKey: ['browse'] as QueryKey };

const patchAnimeDetail = (client: QueryClient, animeId: number, transform: AnimeTransform) => {
  const previous = client.getQueryData<AnimeDetail>(animeDetailKey(animeId));
  if (!previous) return undefined;

  client.setQueryData<AnimeDetail>(animeDetailKey(animeId), old =>
    old ? { ...old, ...transform(old) } : old);

  return previous;
};

const patchBrowseSection = (client: QueryClient, animeId: number, transform: AnimeTransform) => {
  const previous = client.getQueryData<BrowseSection>(browseSectionKey);
  if (!previous) return undefined;

  const patchPage = (page: AnimePage): AnimePage => ({
    ...page,
    data: page.data.map(anime => anime.id === animeId ? transform(anime) : anime),
  });

  client.setQueryData<BrowseSection>(browseSectionKey, old =>
    old ? {
      ...old,
      season: patchPage(old.season),
      nextSeason: patchPage(old.nextSeason),
      topLastSeason: patchPage(old.topLastSeason),
      top: patchPage(old.top),
    } : old);

  return previous;
};

const patchBrowse = (client: QueryClient, animeId: number, transform: AnimeTransform) => {
  const previous = client.getQueriesData<InfiniteData<AnimePage>>(browseFilter);
  if (!previous || previous.length === 0) return undefined;

  client.setQueriesData<InfiniteData<AnimePage>>(browseFilter, old =>
    old?.pages ? {
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        data: page.data.map(anime => anime.id === animeId ? transform(anime) : anime),
      })),
    } : old);

  return previous;
};

/** Cancels every in-flight anime-facing query so an optimistic write is not overwritten by a stale refetch. */
export const cancelAnimeQueries = async (client: QueryClient, animeId: number) => {
  await client.cancelQueries({ queryKey: animeDetailKey(animeId) });
  await client.cancelQueries({ queryKey: browseSectionKey });
  await client.cancelQueries(browseFilter);
};

/**
 * Applies transform to the target anime across the anime detail, browse section and
 * browse caches, returning a snapshot for rollback.
 *
 * The library cache it not easily optimistically updated, so the cache gets just invalidated
 */
export const applyAnimeTransform = (
  client: QueryClient,
  animeId: number,
  transform: AnimeTransform,
): AnimeCacheSnapshot => ({
  animeDetail: patchAnimeDetail(client, animeId, transform),
  browseSection: patchBrowseSection(client, animeId, transform),
  browse: patchBrowse(client, animeId, transform),
});

/** Restores the caches captured in snapshot in case of mutation errors */
export const restoreAnimeCaches = (client: QueryClient, animeId: number, snapshot?: AnimeCacheSnapshot) => {
  if (!snapshot) return;

  if (snapshot.animeDetail) {
    client.setQueryData(animeDetailKey(animeId), snapshot.animeDetail);
  }

  if (snapshot.browseSection) {
    client.setQueryData(browseSectionKey, snapshot.browseSection);
  }

  // Each browse page is its own cache entry, so restore them key-by-key.
  snapshot.browse?.forEach(([key, data]) => client.setQueryData(key, data));
};

/** Invalidates the library cache so it refetches — the always-consistent update for a list/status-grouped view. */
export const invalidateLibrary = (client: QueryClient) =>
  client.invalidateQueries({ queryKey: ['library'] });
