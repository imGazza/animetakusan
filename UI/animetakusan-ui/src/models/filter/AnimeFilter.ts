export interface AnimeFilterRequest {
  filter: AnimeFilter;
  page: AnimePage;
  sort: string;
}

export interface AnimeFilter {
  search?: string;
  format?: string;
  genreIn?: string[];
  averageScoreGreater?: number | null;
  status?: string;
  season?: string;
  seasonYear?: number | null;
}

interface AnimePage{
  page: number,
  perPage: number,
}