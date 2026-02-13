import type { AnimeFormatKey } from "./AnimeFormat";

export interface Anime {
  id: number;
  title: Title;
  coverImage: CoverImage;
  startDate: DetailedDate;
  endDate: DetailedDate;
  bannerImage: string;
  season: string;
  seasonYear: number | null;
  description: string;
  type: string;
  format: AnimeFormatKey;
  status: string;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  isAdult: boolean | null;
  averageScore: number | null;
  nextAiringEpisode: AiringSchedule | null;
  studios: StudioConnection;
}

export interface Title {
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  color: string;
}

export interface DetailedDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AiringSchedule {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface StudioConnection {
  nodes: Studio[];
}

export interface Studio {
  id: number;
  name: string;
}