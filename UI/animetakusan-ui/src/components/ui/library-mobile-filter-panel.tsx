import FilterCombobox from "./filter-combobox";
import FilterSelect from "./filter-select";
import { capitalize } from "@/lib/utils";
import type { FilterSeasonOption } from "@/lib/filter-options";
import type { LibraryFilter } from "@/models/filter/LibraryFilter";

const LibraryMobileFilterPanel = ({ genres, years, seasons, formats, statuses, filter, addFilter }:
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
    <div className="gap-4 flex flex-nowrap overflow-x-auto no-scrollbar md:hidden">
      <div className="w-46 shrink-0"><FilterCombobox items={genres} title="Genre" value={filter?.genreIn ?? null} onChange={(value) => addFilter("genreIn", value)} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={seasons.map(season => season.value)} title="Season" value={filter?.season ? capitalize(filter.season) : null} onChange={setSeasonYear} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={years} title="Year" value={filter?.seasonYear != null ? String(filter.seasonYear) : null} onChange={(value) => addFilter("seasonYear", Number(value))} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={formats} title="Formats" value={filter?.format ?? null} onChange={(value) => addFilter("format", value)} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={statuses} title="Airing Status" value={filter?.status ?? null} onChange={(value) => addFilter("status", value)} /></div>      
    </div>
  )
}
export default LibraryMobileFilterPanel;