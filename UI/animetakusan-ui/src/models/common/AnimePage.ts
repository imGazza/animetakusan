import type { Anime } from "./Anime";

export interface AnimePage {
    page: AnimePageInfo,
    data: Anime[]
}

interface AnimePageInfo{
    perPage: number,
    currentPage: number,
    hasNextPage: boolean,
}