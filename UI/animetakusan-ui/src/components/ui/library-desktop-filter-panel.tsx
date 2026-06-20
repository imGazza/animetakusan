import FilterNumber from "./filter-number";
import FilterRadio from "./filter-radio";
import FilterSeasons from "./filter-seasons";
import FilterToggle from "./filter-toggle";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { capitalize } from "@/lib/utils";
import type { FilterSeasonOption } from "@/lib/filter-options";
import type { LibraryFilter } from "@/models/filter/LibraryFilter";

const LibraryDesktopFilterPanel = ({ genres, years, seasons, formats, statuses, filter, addFilter }:
  {
    genres: string[],
    formats: string[],
    statuses: string[],
    seasons: FilterSeasonOption[],
    years: string[],
    filter: LibraryFilter | null,
    addFilter: <K extends keyof LibraryFilter>(key: K, value: LibraryFilter[K]) => void
  }
) => {

  const setSeasonYear = (season: string | null) => {
    addFilter("season", season);
    if(season && !filter?.seasonYear){
      addFilter("seasonYear", new Date().getFullYear());
    }
  }

  return (
    <div className="gap-4 hidden md:flex">
      <div className="flex flex-col gap-4 w-1/2">
        <FilterToggle options={genres} value={filter?.genreIn ?? null} title="Genres" onChange={(value) => addFilter("genreIn", value)}/>
        <FilterRadio options={formats} value={filter?.format ?? null} title="Format" onChange={(value) => addFilter("format", value)} />
        <FilterRadio options={statuses} value={filter?.status ?? null} title="Airing Status" onChange={(value) => addFilter("status", value)} />
        <FilterNumber value={filter?.averageScoreGreater ?? null} onChange={(value) => addFilter("averageScoreGreater", value)} title="Score Greater Than" />
      </div>
      <div className="flex flex-col gap-4 w-1/2">
        <FilterSeasons options={seasons} value={filter?.season ? capitalize(filter.season) : null} title="Season" onChange={setSeasonYear} />
        <FilterRadio options={years} value={filter?.seasonYear != null ? String(filter.seasonYear) : null} title="Year" onChange={(value) => addFilter("seasonYear", value ? Number(value) : null)} />
      </div>
    </div>
  )
}
export default LibraryDesktopFilterPanel;
