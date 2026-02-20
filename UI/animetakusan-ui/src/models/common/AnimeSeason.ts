import { z } from "zod";

// Enum definition
export const AnimeSeasonKeySchema = z.enum([
  "WINTER",
  "SPRING",
  "SUMMER",
  "FALL"
]);

// Infered type from the enum schema
export type AnimeSeasonKey = z.infer<typeof AnimeSeasonKeySchema>;

// Display names for each anime season
export const ANIME_SEASON_DISPLAY: Record<AnimeSeasonKey, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall"
} as const;

// Search for the key and returns the display name, if any
export function displaySeason(value: unknown): string | null {
  const seasonKey = parseSeason(value);
  return seasonKey ? getSeasonDisplay(seasonKey) : null;
}

function getSeasonDisplay(seasonKey: AnimeSeasonKey): string {
  return ANIME_SEASON_DISPLAY[seasonKey];
}

function parseSeason(value: unknown): AnimeSeasonKey | null {
  const result = AnimeSeasonKeySchema.safeParse(value);
  return result.success ? result.data : null;
}