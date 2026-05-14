import { AnimeEntryStatusKeySchema } from "@/models/common/AnimeEntryStatus";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";

export const generateEmptyEntry = (): AnimeEntryUpsert => ({
  mediaId: 0,
  progress: 0,
  status: AnimeEntryStatusKeySchema.enum.PLANNING,
  startedAt: null,
  completedAt: null,
  score: 0,
});