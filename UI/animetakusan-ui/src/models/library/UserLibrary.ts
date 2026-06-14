import type { Anime } from "../common/Anime"

export interface UserLibrary {
  lists: AnimeList[]
}

export interface AnimeList {
  name: string,
  entries: AnimeEntry[]
}

export interface AnimeEntry {
  id: number,
  anime: Anime
}

