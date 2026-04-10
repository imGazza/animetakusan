import FilterRadio from "./filter-radio";
import FilterSeasons from "./filter-seasons";
import FilterToggle from "./filter-toggle";

const DesktopFilterPanel = ({ genres, formats, airingStatuses, seasons, years }:
	{
		genres: string[], 
		formats: string[], 
		airingStatuses: string[], 
		seasons: { value: string, icon: any, selectedColor: string }[], 
		years: string[]
	}
) => {
	return (
		<div className="gap-4 hidden md:flex">
			<div className="flex flex-col gap-4 w-1/2">
				<FilterToggle data={genres} title="Genres" />
				<FilterToggle data={formats} title="Format" />
				<FilterRadio data={airingStatuses} title="Airing Status" />
			</div>
			<div className="flex flex-col gap-4 w-1/2">
				<FilterSeasons data={seasons} title="Season" />
				<FilterRadio data={[...years].reverse()} title="Year" />
			</div>
		</div>
	)
}
export default DesktopFilterPanel;
