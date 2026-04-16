import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import FilterCombobox from "./filter-combobox";
import FilterSelect from "./filter-select";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { capitalize } from "@/lib/utils";
import type { FilterSeasonOption } from "@/lib/filter-options";

const MobileFilterPanel = ({ genres, years, seasons, formats, statuses, filter }:
	{
		genres: string[], 
		formats: string[], 
		statuses: string[], 
    seasons: FilterSeasonOption[], 
		years: string[],
    filter: AnimeFilter | null
	}
) => {

  const [, setGenre ] = useQueryState('genre', parseAsArrayOf(parseAsString));
  const [, setFormat ] = useQueryState('format', parseAsString);
  const [, setStatus ] = useQueryState('status', parseAsString);
  const [, setSeason ] = useQueryState('season', parseAsString);
  const [, setYear ] = useQueryState('year', parseAsString);

  const setSeasonYear = (season: string | null) => {
    setSeason(season);
    if(season && !filter?.seasonYear){
      setYear(String(new Date().getFullYear()));
    }
  }

  return (
    <div className="gap-4 flex flex-nowrap overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden md:hidden">
      <div className="w-46 shrink-0"><FilterCombobox items={genres} title="Genre" value={filter?.genreIn ?? null} onChange={setGenre} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={seasons.map(season => season.value)} title="Season" value={filter?.season ? capitalize(filter.season) : null} onChange={setSeasonYear} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={years} title="Year" value={filter?.seasonYear != null ? String(filter.seasonYear) : null} onChange={setYear} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={formats} title="Formats" value={filter?.format ?? null} onChange={setFormat} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={statuses} title="Airing Status" value={filter?.status ?? null} onChange={setStatus} /></div>      
    </div>
  )
}
export default MobileFilterPanel;