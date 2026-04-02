import { httpClient } from "@/http/client";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import type { BrowseSection } from "@/models/browse/BrowseSection";
import type { AnimePage } from "@/models/common/AnimePage";

export const browseApis = {
  browseSection: () => httpClient.get<BrowseSection>('/anime/browse'),
  browse: (filter: AnimeFilter) => httpClient.post<AnimePage>('/anime', filter)
}