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

  return (
    <div className="gap-4 flex flex-nowrap overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden md:hidden">
      <div className="w-46 shrink-0"><FilterCombobox items={genres} title="Genre" /></div>
      <div className="w-46 shrink-0"><FilterSelect items={seasons.map(season => season.value)} title="Season" /></div>
      <div className="w-46 shrink-0"><FilterCombobox items={formats} title="Formats" /></div>
      <div className="w-46 shrink-0"><FilterSelect items={airingStatuses} title="Airing Status" /></div>
      <div className="w-46 shrink-0"><FilterSelect items={years} title="Year" /></div>
    </div>
  )
}
export default MobileFilterPanel;