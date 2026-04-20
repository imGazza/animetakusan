import type { Anime, CoverImage, Title } from "./Anime";

export interface AnimeDetail extends Anime {
    relations: Relation[];
}

export interface Relation {
    id: number;
    title: Title;
    coverImage: CoverImage;
    relationType: string;
}