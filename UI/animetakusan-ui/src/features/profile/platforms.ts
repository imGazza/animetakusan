import AniListLogo from "./AniListLogo";
import MyAnimeListLogo from "./MyAnimeListLogo";
import type { ComponentType } from "react";

export interface Platform {
  /** Matches the value emitted by the backend `SyncedAccounts` enum (User.linkedAccounts). */
  key: "AniList" | "MyAnimeList";
  name: string;
  description: string;
  /** Brand colour used for accents, the logo tile and the connect button. */
  brand: string;
  /** Subtle gradient end colour for the logo tile. */
  brandTo: string;
  Logo: ComponentType<{ className?: string }>;
  /** Absolute backend endpoint the browser is redirected to in order to link the account. */
  authUrl: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const platforms: Platform[] = [
  {
    key: "AniList",
    name: "AniList",
    description: "Sync your lists, scores and progress with your AniList account.",
    brand: "#02A9FF",
    brandTo: "#0067D8",
    Logo: AniListLogo,
    authUrl: `${apiBaseUrl}/anilist/auth`,
  },
  {
    key: "MyAnimeList",
    name: "MyAnimeList",
    description: "Connect MyAnimeList to keep your anime collection in sync.",
    brand: "#2E51A2",
    brandTo: "#1B2F63",
    Logo: MyAnimeListLogo,
    authUrl: `${apiBaseUrl}/malauth/login`,
  },
];
