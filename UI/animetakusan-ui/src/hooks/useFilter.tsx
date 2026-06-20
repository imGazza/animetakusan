import { arrayStringParser, integerParser, stringParser } from "@/lib/filter-parsers";
import { presetFilters } from "@/lib/preset-filters";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { useQueryState, useQueryStates } from "nuqs";

const queryParamsSchema = {
  season: stringParser,
  year: integerParser,
  format: stringParser,
  search: stringParser,
  status: stringParser,
  score: integerParser,
  genre: arrayStringParser,
};

const emptyFilterQueryValues = {
  season: null,
  year: null,
  format: null,
  search: null,
  status: null,
  score: null,
  genre: null
};

const filterMapToQueryKey: Record<keyof AnimeFilter, keyof typeof queryParamsSchema> = {
  season: "season",
  seasonYear: "year",
  format: "format",
  search: "search",
  status: "status",
  averageScoreGreater: "score",
  genreIn: "genre",
};


const useFilter = () => {

  const [params, setParams] = useQueryStates(queryParamsSchema);
  const [sort, setSort] = useQueryState("sort", stringParser);

  const translateQueryParamsToFilter = () => ({
    season: params.season ?? undefined,
    seasonYear: params.year ?? undefined,
    format: params.format ?? undefined,
    search: params.search ?? undefined,
    status: params.status ?? undefined,
    averageScoreGreater: params.score ?? undefined,
    genreIn: params.genre ?? undefined,
  });

  const removeSingleFilter = (key: keyof AnimeFilter, value: string) => {
    const queryKey = filterMapToQueryKey[key];
    if (Array.isArray(params[queryKey])) {
      const remainingValues = (params[queryKey] as string[]).filter(item => item !== value);
      setParams({
        ...params,
        [queryKey]: remainingValues.length > 0 ? remainingValues : null
      });
    } else {
      setParams({
        ...params,
        [queryKey]: null
      });
    }
  }

  const applyPresetFilter = (filterName: string) => {
    const preset = presetFilters.find(p => p.name === filterName);
    if (preset) {
     // Set filter params and sort separately
      setParams(preset.params);
      setSort(preset.sort);
    }
  }

  const isFilterActive = Object.values(params).some(value => value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0));
  const filter = isFilterActive ? translateQueryParamsToFilter() : null;
  const isSortActive = !!sort;

  return {
    isFilterActive,
    isSortActive,
    filter,
    sort: sort ?? undefined,
    removeFilter: removeSingleFilter,
    resetAllFilters: () => { setParams(emptyFilterQueryValues); setSort(sort == "PopularityDesc" || sort == "SearchMatch" ? null : sort); },
    applyPresetFilter
  }
}
export default useFilter;