import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { getCurrentSeason, getCurrentSeasonYear, getNextSeason, getNextSeasonYear, getPreviousSeason as getLastSeason, getPreviousSeasonYear as getLastSeasonYear } from "./season-manager";

export const presetFilters: PresetFilter[] = [
    {
        name: "season",
        filter: {
            season: getCurrentSeason(),
            seasonYear: getCurrentSeasonYear()
        }
    },
    {
        name: "next-season",
        filter: {
            season: getNextSeason(),
            seasonYear: getNextSeasonYear()
        }
    },
    {
        name: "last-season",
        filter: {
            season: getLastSeason(),
            seasonYear: getLastSeasonYear()
        }
    },
    // To add when sorting is handled
    // {
    //     name: "top",
    //     filter: {
    //         season: getLastSeason(),
    //         seasonYear: getLastSeasonYear()
    //     }
    // }
]

interface PresetFilter {
    name: string;
    filter: AnimeFilter;
}