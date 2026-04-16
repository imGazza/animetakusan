import FilterNumber from "./filter-number";
import FilterRadio from "./filter-radio";
import FilterSeasons from "./filter-seasons";
import FilterToggle from "./filter-toggle";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { capitalize } from "@/lib/utils";
import type { FilterSeasonOption } from "@/lib/filter-options";

const DesktopFilterPanel = ({ genres, years, seasons, formats, statuses, filter }:
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
  const [, setScore ] = useQueryState('score', parseAsInteger);

  const setSeasonYear = (season: string | null) => {
    setSeason(season);
    if(season && !filter?.seasonYear){
      setYear(String(new Date().getFullYear()));
    }
  }

  return (
    <div className="gap-4 hidden md:flex">
      <div className="flex flex-col gap-4 w-1/2">
        <FilterToggle options={genres} value={filter?.genreIn ?? null} title="Genres" onChange={setGenre}/>
        <FilterRadio options={formats} value={filter?.format ?? null} title="Format" onChange={setFormat} />
        <FilterRadio options={statuses} value={filter?.status ?? null} title="Airing Status" onChange={setStatus} />
        <FilterNumber value={filter?.averageScoreGreater ?? null} onChange={setScore} title="Score Greater Than" />
      </div>
      <div className="flex flex-col gap-4 w-1/2">
        <FilterSeasons options={seasons} value={filter?.season ? capitalize(filter.season) : null} title="Season" onChange={setSeasonYear} />
        <FilterRadio options={years} value={filter?.seasonYear != null ? String(filter.seasonYear) : null} title="Year" onChange={setYear} />
      </div>
    </div>
  )
}
export default DesktopFilterPanel;
