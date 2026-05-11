import type { Anime, Title } from "./Anime";

export interface AnimeDetail extends Anime {
  source: string;
  popularity: number;
  favourites: number;
  relations: Relation[];
  recommendations: Recommendation[];
  reviews: Review[];
  rankings: Ranking[];
}

interface Relation {
  id: number;
  title: Title;
  coverImage: SmallCoverImage;
  relationType: string;
  format: string;
  status: string;
}

interface Recommendation {
  id: number;
  title: Title;
  coverImage: SmallCoverImage;
  averageScore: number;
}

interface SmallCoverImage {
  large: string;
  color: string;
}

interface Review {
  ratingAmount: number;
  rating: number;
  score: number;
  summary: string;
  siteUrl: string;
  user: User;
}

interface User {
  name: string;
  avatar: string;
}

interface Ranking {
  rank: number;
  context: string;
  type: string;
  allTime: boolean;
  season: string | null;
  year: number;
}