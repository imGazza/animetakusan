import type { Anime, DetailedDate } from "@/models/common/Anime";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import type { AnimeEntry, UserLibrary } from "@/models/library/UserLibrary";
import { startOfDay } from "date-fns";

export const WATCHING_LIST = "Watching";
const WEEK_SECONDS = 7 * 24 * 60 * 60;
const DAY_MS = 24 * 60 * 60 * 1000;
/** How long after its final episode a finished show keeps feeding the backlog. */
const FINISHED_LOOKBACK_DAYS = 60;
/** How far ahead a not-yet-released Planning show is worth surfacing. */
const PLANNING_UPCOMING_DAYS = 30;

export function getListEntries(library: UserLibrary | undefined, name: string): AnimeEntry[] {
  return library?.lists.find((l) => l.name.toLowerCase() === name.toLowerCase())?.entries ?? [];
}

function detailedDateToDate(d: DetailedDate | null | undefined): Date | null {
  if (!d || d.year == null) return null;
  return new Date(d.year, (d.month ?? 1) - 1, d.day ?? 1);
}

/** Like detailedDateToDate, but only for fully-specified dates (no guessing a missing day/month). */
function exactDate(d: DetailedDate | null | undefined): Date | null {
  if (!d || d.year == null || d.month == null || d.day == null) return null;
  return new Date(d.year, d.month - 1, d.day);
}

const toDetailedDate = (date: Date): DetailedDate => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

export interface BacklogEpisode {
  key: string;
  anime: Anime;
  episode: number;
  airedAt: Date;
}

/**
 * Aired-but-unwatched episodes of a single show, with their (estimated) air date.
 *
 * - Airing shows: `nextAiringEpisode` is the only reliable timestamp, so earlier
 *   episodes are back-calculated from the weekly cadence.
 * - Recently finished shows: there's no schedule anymore, so air dates are spread
 *   evenly between `startDate` (ep 1) and `endDate` (last ep). That covers both weekly
 *   releases and all-at-once drops (start == end). Shows that ended more than
 *   FINISHED_LOOKBACK_DAYS ago are left out — that's a binge, not a backlog.
 */
function unwatchedAiredEpisodes(anime: Anime, nowMs: number): { episode: number; airedAt: Date }[] {
  const watched = anime.mediaListEntry?.progress ?? 0;
  const result: { episode: number; airedAt: Date }[] = [];

  const next = anime.nextAiringEpisode;
  if (next) {
    for (let ep = watched + 1; ep < next.episode; ep++) {
      const airedAt = new Date((next.airingAt - (next.episode - ep) * WEEK_SECONDS) * 1000);
      if (airedAt.getTime() <= nowMs) result.push({ episode: ep, airedAt });
    }
    return result;
  }

  const total = anime.episodes;
  const end = exactDate(anime.endDate);
  if (anime.status !== "FINISHED" || !total || !end) return result;
  if (nowMs - end.getTime() > FINISHED_LOOKBACK_DAYS * DAY_MS) return result;

  const start = exactDate(anime.startDate) ?? end;
  const span = end.getTime() - start.getTime();

  for (let ep = watched + 1; ep <= total; ep++) {
    const estimate = total === 1 ? end : new Date(start.getTime() + (span * (ep - 1)) / (total - 1));
    const airedAt = startOfDay(estimate);
    if (airedAt.getTime() <= nowMs) result.push({ episode: ep, airedAt });
  }
  return result;
}

/** Episodes that have already aired but the user hasn't watched yet, for the shows they're watching. */
export function getBacklogEpisodes(watching: AnimeEntry[], now: Date): BacklogEpisode[] {
  const nowMs = now.getTime();
  const episodes: BacklogEpisode[] = [];

  for (const { anime } of watching) {
    for (const { episode, airedAt } of unwatchedAiredEpisodes(anime, nowMs)) {
      episodes.push({ key: `${anime.id}-${episode}`, anime, episode, airedAt });
    }
  }

  return episodes.sort((a, b) => b.airedAt.getTime() - a.airedAt.getTime());
}

export interface PlanningHighlight {
  anime: Anime;
  kind: "airing" | "upcoming";
  /** Airing: when it started. Upcoming: when it premieres. */
  date: Date | null;
  /** Airing only: how many episodes are already out. */
  airedEpisodes?: number;
}

/**
 * Shows sitting in the user's Planning list that just became relevant: already airing
 * (so they can start keeping up) or premiering within PLANNING_UPCOMING_DAYS.
 * Filters on the entry status rather than the list name, so it keeps working while a
 * just-started show is still in the "Planning" list waiting for the library refetch.
 */
export function getPlanningHighlights(library: UserLibrary | undefined, now: Date, limit = 6): PlanningHighlight[] {
  const nowMs = now.getTime();
  const seen = new Set<number>();
  const airing: PlanningHighlight[] = [];
  const upcoming: PlanningHighlight[] = [];

  for (const list of library?.lists ?? []) {
    for (const { anime } of list.entries) {
      if (anime.mediaListEntry?.status !== "PLANNING" || seen.has(anime.id)) continue;
      seen.add(anime.id);

      const next = anime.nextAiringEpisode;
      const aired = next ? next.episode - 1 : (anime.episodes ?? 0);

      if (anime.status === "RELEASING" && aired >= 1) {
        airing.push({ anime, kind: "airing", date: exactDate(anime.startDate), airedEpisodes: aired });
        continue;
      }

      if (anime.status === "RELEASING" || anime.status === "NOT_YET_RELEASED") {
        const premiere = next ? new Date(next.airingAt * 1000) : exactDate(anime.startDate);
        if (!premiere) continue;
        const untilMs = premiere.getTime() - nowMs;
        if (untilMs >= 0 && untilMs <= PLANNING_UPCOMING_DAYS * DAY_MS) {
          upcoming.push({ anime, kind: "upcoming", date: premiere });
        }
      }
    }
  }

  // Airing: most recently started first. Upcoming: soonest premiere first.
  airing.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  upcoming.sort((a, b) => a.date!.getTime() - b.date!.getTime());

  return [...airing, ...upcoming].slice(0, limit);
}

/** Splits the stored entry into the upsert shape, dropping the server-owned fields. */
function baseUpsert(anime: Anime): AnimeEntryUpsert | null {
  const entry = anime.mediaListEntry;
  if (!entry) return null;
  return {
    mediaId: entry.mediaId,
    malId: anime.idMal,
    progress: entry.progress,
    status: entry.status,
    startedAt: entry.startedAt,
    completedAt: entry.completedAt,
    score: entry.score,
  };
}

/**
 * "I've watched up to episode N". Same rules as the card's +1 (useAnimeProgress):
 * Planning → Current and startedAt set on first progress. Additionally, marking the
 * final episode completes the entry (status + completedAt), so a finished show leaves
 * the Watching list instead of lingering at N/N.
 */
export function watchedUpToUpsert(anime: Anime, episode: number, now: Date): AnimeEntryUpsert | null {
  const base = baseUpsert(anime);
  if (!base) return null;

  const current = anime.mediaListEntry!;
  const finished = anime.episodes != null && episode >= anime.episodes;

  return {
    ...base,
    progress: Math.max(episode, current.progress ?? 0),
    status: finished ? "COMPLETED" : current.status === "PLANNING" ? "CURRENT" : null,
    startedAt: current.startedAt ? null : toDetailedDate(now),
    completedAt: finished ? toDetailedDate(now) : null,
  };
}

export type ActivityType = "completed" | "watching" | "planned" | "paused" | "dropped" | "rated";

export interface ActivityItem {
  key: string;
  type: ActivityType;
  anime: Anime;
  at: Date;
  detail?: string;
}

/**
 * There is no dedicated activity endpoint, so the feed is reconstructed from the
 * timestamps and status already present on each list entry (`mediaListEntry`).
 */
export function buildActivity(library: UserLibrary | undefined, limit = 9): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const list of library?.lists ?? []) {
    for (const { anime } of list.entries) {
      const entry = anime.mediaListEntry;
      if (!entry) continue;

      const created = new Date(entry.createdAt * 1000);
      const started = detailedDateToDate(entry.startedAt);
      const completed = detailedDateToDate(entry.completedAt);

      switch (entry.status) {
        case "COMPLETED":
          items.push({ key: `c-${anime.id}`, type: "completed", anime, at: completed ?? created });
          if (entry.score > 0)
            items.push({ key: `r-${anime.id}`, type: "rated", anime, at: completed ?? created, detail: String(entry.score) });
          break;
        case "CURRENT":
        case "REPEATING":
          items.push({
            key: `w-${anime.id}`,
            type: "watching",
            anime,
            at: started ?? created,
            detail: entry.progress ? String(entry.progress) : undefined,
          });
          break;
        case "PAUSED":
          items.push({ key: `pa-${anime.id}`, type: "paused", anime, at: created });
          break;
        case "DROPPED":
          items.push({ key: `d-${anime.id}`, type: "dropped", anime, at: created });
          break;
        default:
          items.push({ key: `p-${anime.id}`, type: "planned", anime, at: created });
      }
    }
  }

  return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
}

export function animeTitle(anime: Anime): string {
  return anime.title.english || anime.title.romaji || anime.title.native || "Untitled";
}
