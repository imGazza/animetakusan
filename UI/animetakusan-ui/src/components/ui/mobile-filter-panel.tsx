import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import FilterCombobox from "./filter-combobox";
import FilterSelect from "./filter-select";

const MobileFilterPanel = ({ genres, formats, airingStatuses, seasons, years }:
	{
		genres: string[], 
		formats: string[], 
		airingStatuses: string[], 
		seasons: { value: string, icon: any, selectedColor: string }[], 
		years: string[]
	}
) => {

  const [ genre, setGenre ] = useQueryState('genre', parseAsArrayOf(parseAsString).withDefault([]));
  const [ format, setFormat ] = useQueryState('format', parseAsString.withDefault(''));
  const [ status, setStatus ] = useQueryState('status', parseAsString.withDefault(''));
  const [ season, setSeason ] = useQueryState('season', parseAsString.withDefault(''));
  const [ year, setYear ] = useQueryState('year', parseAsString.withDefault(''));

  const setSeasonYear = (season: string) => {
    setSeason(season);
    if(!year){
      setYear(String(new Date().getFullYear()));
    }
  }

  return (
    <div className="gap-4 flex flex-nowrap overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden md:hidden">
      <div className="w-46 shrink-0"><FilterCombobox items={genres} title="Genre" value={genre} onChange={setGenre} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={seasons.map(season => season.value)} title="Season" value={season} onChange={setSeasonYear} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={years} title="Year" value={year} onChange={setYear} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={formats} title="Formats" value={format} onChange={setFormat} /></div>
      <div className="w-46 shrink-0"><FilterSelect items={airingStatuses} title="Airing Status" value={status} onChange={setStatus} /></div>      
    </div>
  )
}
export default MobileFilterPanel;