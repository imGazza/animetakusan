import FilterNumber from "./filter-number";
import FilterRadio from "./filter-radio";
import FilterSeasons from "./filter-seasons";
import FilterToggle from "./filter-toggle";
import { useQueryState } from "nuqs";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { capitalize } from "@/lib/utils";
import type { FilterSeasonOption } from "@/lib/filter-options";
import { arrayStringParser, integerParser, stringParser } from "@/lib/filter-parsers";

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
  
  const [, setGenre ] = useQueryState('genre', arrayStringParser);
  const [, setFormat ] = useQueryState('format', stringParser);
  const [, setStatus ] = useQueryState('status', stringParser);
  const [, setSeason ] = useQueryState('season', stringParser);
  const [, setYear ] = useQueryState('year', stringParser);
  const [, setScore ] = useQueryState('score', integerParser);

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
