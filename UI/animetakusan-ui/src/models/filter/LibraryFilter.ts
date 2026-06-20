export interface LibraryFilter {
  search?: string | null;
  format?: string | null;
  genreIn?: string[] | null;
  averageScoreGreater?: number | null;
  status?: string | null;
  season?: string | null;
  seasonYear?: number | null;
}