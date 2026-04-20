import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { httpClient } from "../client";

export const animeApis = {
  animeDetail: (id: number) => httpClient.get<AnimeDetail>(`/anime/${id}`)
}