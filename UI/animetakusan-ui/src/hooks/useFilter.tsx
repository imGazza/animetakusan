import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from "nuqs";
import { useParams } from "react-router";
import { presetFilters } from "@/lib/preset-filters";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";

const useFilter = (): {
  filter: AnimeFilter | null;
  isFilterActive: boolean;
  removeFilter: (key: keyof AnimeFilter, value?: string) => void;
  resetFilter: () => void;
} => {
  const { preset } = useParams<{ preset?: string }>();

  const [params, setParams] = useQueryStates({
    season: parseAsString,
    year: parseAsInteger,
    format: parseAsString,
    search: parseAsString,
    status: parseAsString,
    score: parseAsInteger,
    genre: parseAsArrayOf(parseAsString)
  });

  if (preset) {
    const presetFilter = presetFilters.find(p => p.name === preset)?.filter ?? null;
    return { filter: presetFilter, isFilterActive: !!presetFilter, removeFilter: () => { }, resetFilter: () => { } };
  }

  const filter: AnimeFilter = {
    season: params.season ?? undefined,
    seasonYear: params.year ?? undefined,
    format: params.format ?? undefined,
    search: params.search ?? undefined,
    status: params.status ?? undefined,
    averageScoreGreater: params.score ?? undefined,
    genreIn: params.genre ?? undefined,
  };

  const isFilterActive = Object.values(filter).some(v =>
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );

  const removeFilter = (key: keyof AnimeFilter, value?: string) => {
    const keyMap: Record<keyof AnimeFilter, string> = {
      season: 'season', seasonYear: 'year', format: 'format',
      search: 'search', status: 'status', averageScoreGreater: 'score', genreIn: 'genre'
    };
    const urlKey = keyMap[key];
    if (key === 'genreIn' && value) {
      const remainingGenres = params.genre?.filter(g => g.toLowerCase() !== value.toLowerCase()) ?? [];
      setParams({ [urlKey]: remainingGenres.length > 0 ? remainingGenres : null });
    } else {
      setParams({ [urlKey]: null });
    }
  };

  const resetFilter = () => {
    setParams({
        season: null,
        year: null,
        format: null,
        search: null,
        status: null,
        score: null,
        genre: null,
    });
  };


  return { filter: isFilterActive ? filter : null, isFilterActive, removeFilter, resetFilter };
};

export default useFilter;