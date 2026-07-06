import type { Anime, DetailedDate } from "@/models/common/Anime";
import type { AnimeEntry, UserLibrary } from "@/models/library/UserLibrary";

export const WATCHING_LIST = "Watching";
const WEEK_SECONDS = 7 * 24 * 60 * 60;

export function getListEntries(library: UserLibrary | undefined, name: string): AnimeEntry[] {
  return library?.lists.find((l) => l.name.toLowerCase() === name.toLowerCase())?.entries ?? [];
}

function detailedDateToDate(d: DetailedDate | null | undefined): Date | null {
  if (!d || d.year == null) return null;
  return new Date(d.year, (d.month ?? 1) - 1, d.day ?? 1);
}

export interface BacklogEpisode {
  key: string;
  anime: Anime;
  episode: number;
  airedAt: Date;
}

/**
 * Episodes that have already aired but the user hasn't watched yet, for the shows
 * they're currently watching. Only currently-airing shows expose a reliable air date
 * (`nextAiringEpisode`); earlier episodes are back-calculated from the weekly cadence.
 */
export function getBacklogEpisodes(watching: AnimeEntry[], now: Date): BacklogEpisode[] {
  const nowMs = now.getTime();
  const episodes: BacklogEpisode[] = [];

  for (const { anime } of watching) {
    const next = anime.nextAiringEpisode;
    if (!next) continue;

    const watched = anime.mediaListEntry?.progress ?? 0;
    const latestAired = next.episode - 1;

    for (let ep = watched + 1; ep <= latestAired; ep++) {
      const airedAt = new Date((next.airingAt - (next.episode - ep) * WEEK_SECONDS) * 1000);
      if (airedAt.getTime() > nowMs) continue;
      episodes.push({ key: `${anime.id}-${ep}`, anime, episode: ep, airedAt });
    }
  }

  return episodes.sort((a, b) => b.airedAt.getTime() - a.airedAt.getTime());
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
