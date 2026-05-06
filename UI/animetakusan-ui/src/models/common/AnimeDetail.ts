import type { Anime, Title } from "./Anime";

export interface AnimeDetail extends Anime {
    source: string;
    popularity: number;
    favourites: number;
    relations: Relation[];
    recommendations: Recommendation[];
}

export interface Relation {
    id: number;
    title: Title;
    coverImage: SmallCoverImage;
    relationType: string;
    format: string;
    status: string;
}

export interface Recommendation{
    id: number;
    title: Title;
    coverImage: SmallCoverImage;
    averageScore: number;
}

export interface SmallCoverImage {
    large: string;
    color: string;
}