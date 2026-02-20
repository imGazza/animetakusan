import { z } from "zod";

// Enum definition
export const AnimeFormatKeySchema = z.enum([
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
  "MANGA",
  "NOVEL",
  "ONE_SHOT"
]);

// Infered type from the enum schema
export type AnimeFormatKey = z.infer<typeof AnimeFormatKeySchema>;

// Display names for each anime format
export const ANIME_FORMAT_DISPLAY: Record<AnimeFormatKey, string> = {
  TV: "TV Show",
  TV_SHORT: "TV Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  MANGA: "Manga",
  NOVEL: "Novel",
  ONE_SHOT: "One Shot"
} as const;

// Search for the key and returns the display name, if any
export function displayFormat(value: unknown): string | null {
  const formatKey = parseFormat(value);
  return formatKey ? getFormatDisplay(formatKey) : null;
}

function getFormatDisplay(formatKey: AnimeFormatKey): string {
  return ANIME_FORMAT_DISPLAY[formatKey];
}

function parseFormat(value: unknown): AnimeFormatKey | null {
  const result = AnimeFormatKeySchema.safeParse(value);
  return result.success ? result.data : null;
}