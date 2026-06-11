import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { httpClient } from "../client";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import type { MediaListEntry } from "@/models/common/Anime";
import type { EntryDeleted } from "@/models/common/EntryDeleted";
import type { ToggleFavourite } from "@/models/common/ToggleFavourite";

export const animeApis = {
  animeDetail: (id: number) => httpClient.get<AnimeDetail>(`/anime/${id}`),
  animeEntryUpsert: (entry: AnimeEntryUpsert): Promise<MediaListEntry> => httpClient.post(`/anime/upsert`, entry),
  deleteAnimeEntry: (animeEntryId: number): Promise<EntryDeleted> => httpClient.post(`/anime/${animeEntryId}/delete-entry`),
  toggleFavourite: (animeId: number): Promise<ToggleFavourite> => httpClient.post(`/anime/${animeId}/toggle-favourite`),
}