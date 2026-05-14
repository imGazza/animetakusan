import type { DetailedDate } from "./Anime";

export interface AnimeEntryUpsert {
  mediaId: number;
  progress: number;
  status: string;
  startedAt: DetailedDate | null;
  completedAt: DetailedDate | null;
  score: number | null;
}