import z from "zod";

export const AnimeSourceKeySchema = z.enum([
    "ORIGINAL",
    "MANGA",
    "LIGHT_NOVEL",
    "VISUAL_NOVEL",
    "VIDEO_GAME",
    "OTHER",
    "NOVEL",
    "DOUJINSHI",
    "ANIME",
    "WEB_NOVEL",
    "LIVE_ACTION",
    "GAME",
    "COMIC",
    "MULTIMEDIA_PROJECT",
    "PICTURE_BOOK"
]);

// Infered type from the enum schema
export type AnimeSourceKey = z.infer<typeof AnimeSourceKeySchema>;

// Search for the key and returns the display name, if any
export const ANIME_SOURCE_DISPLAY: Record<AnimeSourceKey, string> = {
    ORIGINAL: "Original",
    MANGA: "Manga",
    LIGHT_NOVEL: "Light Novel",
    VISUAL_NOVEL: "Visual Novel",
    VIDEO_GAME: "Video Game",
    OTHER: "Other",
    NOVEL: "Novel",
    DOUJINSHI: "Doujinshi",
    ANIME: "Anime",
    WEB_NOVEL: "Web Novel",
    LIVE_ACTION: "Live Action",
    GAME: "Game",
    COMIC: "Comic",
    MULTIMEDIA_PROJECT: "Multimedia Project",
    PICTURE_BOOK: "Picture Book"
} as const;

// Search for the key and returns the display name, if any
export function displaySource(value: unknown): string | null {
  const sourceKey = parseSource(value);
  return sourceKey ? getSourceDisplay(sourceKey) : null;
}

function getSourceDisplay(sourceKey: AnimeSourceKey): string {
  return ANIME_SOURCE_DISPLAY[sourceKey];
}

function parseSource(value: unknown): AnimeSourceKey | null {
  const result = AnimeSourceKeySchema.safeParse(value);
  return result.success ? result.data : null;
}