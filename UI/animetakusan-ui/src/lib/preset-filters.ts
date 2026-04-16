import { getCurrentSeason, getCurrentSeasonYear, getNextSeason, getNextSeasonYear, getPreviousSeason as getLastSeason, getPreviousSeasonYear as getLastSeasonYear } from "./season-manager";

export const presetFilters = [
  {
    name: "season",
    params: {
      season: getCurrentSeason(),
      year: getCurrentSeasonYear()
    },
    sort: null
  },
  {
    name: "next-season",
    params: {
      season: getNextSeason(),
      year: getNextSeasonYear()
    },
    sort: null
  },
  {
    name: "last-season",
    params: {
      season: getLastSeason(),
      year: getLastSeasonYear()
    },
    sort: null
  },
  {
    name: "top",
    params: {},
    sort: "ScoreDesc"
  }
]