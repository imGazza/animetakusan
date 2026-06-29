import type { DetailedDate } from "./Anime";

export interface AnimeEntryUpsert {
  mediaId: number;
  malId: number;
  progress: number | null;
  status: string | null;
  startedAt: DetailedDate | null;
  completedAt: DetailedDate | null;
  score: number | null;
}