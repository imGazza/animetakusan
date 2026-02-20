import { httpClient } from "@/http/client";
import type { BrowseSection } from "@/models/browse/BrowseSection";

export const browseApis = {
  browse: () => httpClient.get<BrowseSection>('/anime/browse')
}