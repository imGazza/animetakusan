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
  format: string;
  status: string;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  isAdult: boolean | null;
  averageScore: number | null;
  nextAiringEpisode: AiringSchedule;
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

// export enum AnimeSeason {
//   WINTER = "WINTER",
//   SPRING = "SPRING",
//   SUMMER = "SUMMER",
//   FALL = "FALL"
// }

// export enum AnimeType {
//   ANIME = "ANIME",
//   MANGA = "MANGA"
// }

// export enum AnimeFormat {
//   TV = "TV",
//   TV_SHORT = "TV_SHORT",
//   MOVIE = "MOVIE",
//   SPECIAL = "SPECIAL",
//   OVA = "OVA",
//   ONA = "ONA",
//   MUSIC = "MUSIC"
// }

// export enum AnimeStatus {
//   FINISHED = "FINISHED",
//   RELEASING = "RELEASING",
//   NOT_YET_RELEASED = "NOT_YET_RELEASED",
//   CANCELLED = "CANCELLED",
//   HIATUS = "HIATUS"
// }