import { useState } from "react";
import FilterNumber from "./filter-number";
import FilterRadio from "./filter-radio";
import FilterSeasons from "./filter-seasons";
import FilterToggle from "./filter-toggle";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";

const DesktopFilterPanel = ({ genres, formats, airingStatuses, seasons, years }:
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
  const [ score, setScore ] = useQueryState('score', parseAsInteger.withDefault(0));

  const setSeasonYear = (season: string) => {
    setSeason(season);
    if(!year){
      setYear(String(new Date().getFullYear()));
    }
  }

  return (
    <div className="gap-4 hidden md:flex">
      <div className="flex flex-col gap-4 w-1/2">
        <FilterToggle options={genres} value={genre ?? []} title="Genres" onChange={setGenre}/>
        <FilterRadio options={formats} value={format ?? ''} title="Format" onChange={setFormat} />
        <FilterRadio options={airingStatuses} value={status ?? ''} title="Airing Status" onChange={setStatus} />
        <FilterNumber value={score} onChange={setScore} title="Score Greater Than" />
      </div>
      <div className="flex flex-col gap-4 w-1/2">
        <FilterSeasons options={seasons} value={season ?? ''} title="Season" onChange={setSeasonYear} />
        <FilterRadio options={[...years].reverse()} value={year ?? ''} title="Year" onChange={setYear} />
      </div>
    </div>
  )
}
export default DesktopFilterPanel;
