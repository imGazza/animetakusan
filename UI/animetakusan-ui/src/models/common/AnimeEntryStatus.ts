import z from "zod";

export const AnimeEntryStatusKeySchema = z.enum([
  "CURRENT",
  "PLANNING",
  "COMPLETED",
  "DROPPED",
  "PAUSED",
  "REPEATING"
]);

export type AnimeEntryStatusKey = z.infer<typeof AnimeEntryStatusKeySchema>;

export const ANIME_ENTRY_STATUS_DISPLAY: Record<AnimeEntryStatusKey, string> = {
  CURRENT: "Watching",
  PLANNING: "Planning",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  PAUSED: "Paused",
  REPEATING: "Repeating"
} as const;

export function displayAnimeEntryStatus(value: unknown): string | null {
  const statusKey = parseAnimeEntryStatus(value);
  return statusKey ? getAnimeEntryStatusDisplay(statusKey) : null;
}

function getAnimeEntryStatusDisplay(statusKey: AnimeEntryStatusKey): string {
  return ANIME_ENTRY_STATUS_DISPLAY[statusKey];
}

function parseAnimeEntryStatus(value: unknown): AnimeEntryStatusKey | null {
  const result = AnimeEntryStatusKeySchema.safeParse(value);
  return result.success ? result.data : null;
}