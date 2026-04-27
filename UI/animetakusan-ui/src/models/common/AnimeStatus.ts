import z from "zod";

export const AnimeStatusKeySchema = z.enum([
  "FINISHED",
  "RELEASING",
  "NOT_YET_RELEASED",
  "CANCELLED",
  "HIATUS"
]);

export type AnimeStatusKey = z.infer<typeof AnimeStatusKeySchema>;

export const ANIME_STATUS_DISPLAY: Record<AnimeStatusKey, string> = {
  FINISHED: "Finished",
  RELEASING: "Airing",
  NOT_YET_RELEASED: "Not Yet Released",
  CANCELLED: "Cancelled",
  HIATUS: "Hiatus"
} as const;

export function displayAnimeStatus(value: unknown): string | null {
  const statusKey = parseAnimeStatus(value);
  return statusKey ? getAnimeStatusDisplay(statusKey) : null;
}

function getAnimeStatusDisplay(statusKey: AnimeStatusKey): string {
  return ANIME_STATUS_DISPLAY[statusKey];
}

function parseAnimeStatus(value: unknown): AnimeStatusKey | null {
  const result = AnimeStatusKeySchema.safeParse(value);
  return result.success ? result.data : null;
}