import type { ViewerInfo } from "@/models/profile/ViewerInfo";
import { httpClient } from "../client";

export const profileApis = {
  getViewer: () => httpClient.get<ViewerInfo>(`/anilist/viewer`)
}