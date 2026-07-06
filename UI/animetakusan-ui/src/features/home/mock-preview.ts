// PREVIEW-ONLY mock data used to verify the Home layout without a live AniList session.
// Removed after design sign-off (together with HomePreview.tsx and the /home-preview route).
import type { Anime } from "@/models/common/Anime";
import type { UserLibrary } from "@/models/library/UserLibrary";

const NOW = Date.now();
const DAY = 24 * 60 * 60;

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/300/450`;

interface MockOpts {
  id: number;
  title: string;
  episodes: number;
  progress: number;
  status: string;
  score?: number;
  color?: string;
  nextInDays?: number;
  nextEpisode?: number;
  createdDaysAgo?: number;
  startedDaysAgo?: number;
  completedDaysAgo?: number;
}

const toDate = (daysAgo?: number) => {
  if (daysAgo == null) return null;
  const d = new Date(NOW - daysAgo * DAY * 1000);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
};

const mock = (o: MockOpts): Anime => ({
  id: o.id,
  idMal: o.id,
  title: { romaji: o.title, english: o.title, native: o.title },
  coverImage: { extraLarge: cover(`ani-${o.id}`), color: o.color ?? "#7c3aed" },
  startDate: toDate(o.startedDaysAgo ?? 120)!,
  endDate: { year: null, month: null, day: null },
  bannerImage: cover(`banner-${o.id}`),
  season: "WINTER",
  seasonYear: 2026,
  description: "",
  type: "ANIME",
  format: "TV",
  status: o.nextInDays != null ? "RELEASING" : "FINISHED",
  isFavourite: false,
  episodes: o.episodes,
  duration: 24,
  genres: ["Action", "Adventure"],
  isAdult: false,
  averageScore: o.score ?? 78,
  nextAiringEpisode:
    o.nextInDays != null && o.nextEpisode != null
      ? { airingAt: Math.floor(NOW / 1000) + o.nextInDays * DAY, timeUntilAiring: o.nextInDays * DAY, episode: o.nextEpisode }
      : null,
  studios: { nodes: [{ id: 1, name: "Studio Takusan" }] },
  mediaListEntry: {
    id: o.id,
    mediaId: o.id,
    createdAt: Math.floor(NOW / 1000) - (o.createdDaysAgo ?? 30) * DAY,
    progress: o.progress,
    status: o.status,
    startedAt: toDate(o.startedDaysAgo),
    completedAt: toDate(o.completedDaysAgo),
    score: o.score ?? 0,
  },
});

const watching: Anime[] = [
  mock({ id: 101, title: "Frieren: Beyond Journey's End", episodes: 28, progress: 5, status: "CURRENT", nextInDays: 2, nextEpisode: 9, startedDaysAgo: 40, color: "#38bdf8" }),
  mock({ id: 102, title: "The Apothecary Diaries", episodes: 24, progress: 9, status: "CURRENT", nextInDays: 5, nextEpisode: 12, startedDaysAgo: 55, color: "#f472b6" }),
  mock({ id: 103, title: "Dan Da Dan", episodes: 12, progress: 7, status: "CURRENT", nextInDays: 1, nextEpisode: 8, startedDaysAgo: 20, color: "#a78bfa" }),
  mock({ id: 104, title: "Blue Box", episodes: 25, progress: 3, status: "CURRENT", nextInDays: 4, nextEpisode: 5, startedDaysAgo: 12, color: "#60a5fa" }),
  mock({ id: 105, title: "Ranma ½", episodes: 12, progress: 10, status: "CURRENT", nextInDays: 3, nextEpisode: 11, startedDaysAgo: 30, color: "#fb7185" }),
];

const completed: Anime[] = [
  mock({ id: 201, title: "Fullmetal Alchemist: Brotherhood", episodes: 64, progress: 64, status: "COMPLETED", score: 96, completedDaysAgo: 3, startedDaysAgo: 60, color: "#facc15" }),
  mock({ id: 202, title: "Vinland Saga", episodes: 24, progress: 24, status: "COMPLETED", score: 89, completedDaysAgo: 11, startedDaysAgo: 40, color: "#34d399" }),
];

const planning: Anime[] = [
  mock({ id: 301, title: "Monster", episodes: 74, progress: 0, status: "PLANNING", createdDaysAgo: 6, color: "#f97316" }),
  mock({ id: 302, title: "Steins;Gate", episodes: 24, progress: 0, status: "PLANNING", createdDaysAgo: 1, color: "#22d3ee" }),
];

const paused: Anime[] = [
  mock({ id: 401, title: "Bleach: Thousand-Year Blood War", episodes: 52, progress: 13, status: "PAUSED", createdDaysAgo: 20, color: "#818cf8" }),
];

export const MOCK_LIBRARY: UserLibrary = {
  lists: [
    { name: "Watching", entries: watching.map((anime) => ({ id: anime.id, anime })) },
    { name: "Completed", entries: completed.map((anime) => ({ id: anime.id, anime })) },
    { name: "Planning", entries: planning.map((anime) => ({ id: anime.id, anime })) },
    { name: "Paused", entries: paused.map((anime) => ({ id: anime.id, anime })) },
  ],
};
