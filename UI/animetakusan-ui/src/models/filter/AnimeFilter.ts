export interface AnimeFilter {
  search?: string;
  format?: string;
  genreIn?: string[];
  averageScoreGreater?: number | null;
  status?: string;
  season?: string;
  seasonYear?: number | null;
}