import type { UserLibrary } from "@/models/library/UserLibrary";
import { httpClient } from "../client";

export const libraryApis = {
  userLibrary: () => httpClient.get<UserLibrary>(`/anime/library`)
}