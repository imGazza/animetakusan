// This hook actually filters the library based on the filter and sort options.

import { getUnixFromDetailedDate } from "@/lib/utils";
import type { Anime } from "@/models/common/Anime";
import type { LibraryFilter } from "@/models/filter/LibraryFilter";
import type { UserLibrary } from "@/models/library/UserLibrary";
import { useMemo } from "react";

export const useFilteredLibrary = (library: UserLibrary | null, filter: LibraryFilter | null, sort: string) => {
  return useMemo(() => {
    if (!library) return null;

    const predicates: Array<(anime: Anime) => boolean> = [];

    if (filter) {
      if (filter.search) {
        const q = filter.search.toLowerCase();
        predicates.push(a =>
          !!(a.title.english?.toLowerCase().includes(q) ||
          a.title.romaji?.toLowerCase().includes(q))
        );
      }

      if (filter.genreIn) {
        predicates.push(a =>
          filter.genreIn!.every(g => a.genres.map(x => x.toLowerCase()).includes(g.toLowerCase()))
        );
      }

      if (filter.status) {
        predicates.push(a => a.status.toLowerCase() === filter.status!.toLowerCase());
      }

      if (filter.seasonYear) {
        predicates.push(a => a.seasonYear === filter.seasonYear);
      }

      if (filter.averageScoreGreater) {
        predicates.push(a => a.averageScore !== null && a.averageScore > filter.averageScoreGreater!);
      }

      if (filter.season) {
        predicates.push(a => a.season?.toLowerCase() === filter.season!.toLowerCase());
      }

      if (filter.format) {
        predicates.push(a => a.format?.toLowerCase() === filter.format!.toLowerCase());
      }
    }

    const lists = library.lists.map(list => {
      const entries = predicates.length > 0
        ? list.entries.filter(entry => predicates.every(p => p(entry.anime)))
        : list.entries;

      const sorted = [...entries].sort((a, b) => {
        const aa = a.anime;
        const ba = b.anime;
        switch (sort) {
          case "Score": return (ba.mediaListEntry?.score ?? 0) - (aa.mediaListEntry?.score ?? 0);
          case "AverageScore": return (ba.averageScore ?? 0) - (aa.averageScore ?? 0);
          case "StartedDate": {
            if (!aa.mediaListEntry?.startedAt) return 1;
            if (!ba.mediaListEntry?.startedAt) return -1;
            return (getUnixFromDetailedDate(ba.mediaListEntry?.startedAt) ?? 0) - (getUnixFromDetailedDate(aa.mediaListEntry?.startedAt) ?? 0);
          }
          case "CompletedDate": {
            if (!aa.mediaListEntry?.completedAt) return 1;
            if (!ba.mediaListEntry?.completedAt) return -1;
            return (getUnixFromDetailedDate(ba.mediaListEntry?.completedAt) ?? 0) - (getUnixFromDetailedDate(aa.mediaListEntry?.completedAt) ?? 0);
          }
          case "LastAdded": return (ba.mediaListEntry?.createdAt ?? 0) - (aa.mediaListEntry?.createdAt ?? 0);          
          default: return (aa.title.english ?? aa.title.romaji ?? "").localeCompare(ba.title.english ?? ba.title.romaji ?? "");
        }
      });

      return { ...list, entries: sorted };
    });

    return { ...library, lists };
  }, [library, filter, sort]);
}