import { httpClient } from "@/http/client";
import type { AnimeFilterRequest } from "@/models/filter/AnimeFilter";
import type { BrowseSection } from "@/models/browse/BrowseSection";
import type { AnimePage } from "@/models/common/AnimePage";

export const browseApis = {
  browseSection: () => httpClient.get<BrowseSection>('/anime/browse'),
  browse: (animeFilterRequest: AnimeFilterRequest) => httpClient.post<AnimePage>('/anime', animeFilterRequest)
}