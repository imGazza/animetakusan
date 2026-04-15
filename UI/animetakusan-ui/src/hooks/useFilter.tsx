import { useEffect } from "react";
import {
  createSerializer,
  createParser,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useLocation, useNavigate, useParams } from "react-router";
import { presetFilters } from "@/lib/preset-filters";
import { capitalize } from "@/lib/utils";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";

type FilterQueryValues = {
  season: string | null;
  year: number | null;
  format: string | null;
  search: string | null;
  status: string | null;
  score: number | null;
  genre: string[] | null;
};

type BrowseQueryValues = FilterQueryValues & {
  sort?: string | null;
};

type UseFilterResult = {
  filter: AnimeFilter | null;
  isFilterActive: boolean;
  removeFilter: (key: keyof AnimeFilter, value?: string) => void;
  resetFilter: () => void;
};

// Season values should be stored in the URL exactly as the UI presents them.
const capitalizedSeasonParser = createParser({
  parse: value => capitalize(value),
  serialize: value => capitalize(value),
});

// These are the editable browse filters that live in the query string.
const filterQueryStateParsers = {
  season: capitalizedSeasonParser,
  year: parseAsInteger,
  format: parseAsString,
  search: parseAsString,
  status: parseAsString,
  score: parseAsInteger,
  genre: parseAsArrayOf(parseAsString),
};

const browseQueryStateParsers = {
  ...filterQueryStateParsers,
  sort: parseAsString,
};

const serializeBrowseUrl = createSerializer(browseQueryStateParsers);

const filterFieldToQueryKey: Record<keyof AnimeFilter, keyof FilterQueryValues> = {
  season: "season",
  seasonYear: "year",
  format: "format",
  search: "search",
  status: "status",
  averageScoreGreater: "score",
  genreIn: "genre",
};

const emptyFilterQueryValues: FilterQueryValues = {
  season: null,
  year: null,
  format: null,
  search: null,
  status: null,
  score: null,
  genre: null,
};

const buildQueryValuesFromPreset = (presetFilter?: AnimeFilter, presetSort?: string): BrowseQueryValues => ({
  season: presetFilter?.season ?? null,
  year: presetFilter?.seasonYear ?? null,
  format: presetFilter?.format ?? null,
  search: presetFilter?.search ?? null,
  status: presetFilter?.status ?? null,
  score: presetFilter?.averageScoreGreater ?? null,
  genre: presetFilter?.genreIn ?? null,
  ...(presetSort ? { sort: presetSort } : {}),
});

const mergeQueryValuesWithPreset = (
  queryValues: FilterQueryValues,
  presetFilter?: AnimeFilter,
  presetSort?: string,
) => ({
  season: queryValues.season ?? presetFilter?.season ?? null,
  year: queryValues.year ?? presetFilter?.seasonYear ?? null,
  format: queryValues.format ?? presetFilter?.format ?? null,
  search: queryValues.search ?? presetFilter?.search ?? null,
  status: queryValues.status ?? presetFilter?.status ?? null,
  score: queryValues.score ?? presetFilter?.averageScoreGreater ?? null,
  genre: queryValues.genre ?? presetFilter?.genreIn ?? null,
  ...(presetSort ? { sort: presetSort } : {}),
});

const mapQueryValuesToFilter = (queryValues: FilterQueryValues): AnimeFilter => ({
  season: queryValues.season ?? undefined,
  seasonYear: queryValues.year ?? undefined,
  format: queryValues.format ?? undefined,
  search: queryValues.search ?? undefined,
  status: queryValues.status ?? undefined,
  averageScoreGreater: queryValues.score ?? undefined,
  genreIn: queryValues.genre ?? undefined,
});

const removeGenreValue = (genres: string[] | null | undefined, value: string): string[] | null => {
  const remainingGenres = genres?.filter(
    genre => genre.toLowerCase() !== value.toLowerCase()
  ) ?? [];

  return remainingGenres.length > 0 ? remainingGenres : null;
};

const removeFilterValueFromQuery = (
  queryValues: BrowseQueryValues,
  key: keyof AnimeFilter,
  value?: string,
) => {
  if (key === "genreIn" && value) {
    return {
      ...queryValues,
      genre: removeGenreValue(queryValues.genre, value),
    };
  }

  return {
    ...queryValues,
    [filterFieldToQueryKey[key]]: null,
  };
};

const useFilter = (): UseFilterResult => {
  const { preset: presetName } = useParams<{ preset?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const matchedPreset = presetFilters.find(({ name }) => name === presetName);
  const presetFilter = matchedPreset?.filter;
  const presetSort = matchedPreset?.sort;
  const presetQueryValues = buildQueryValuesFromPreset(presetFilter, presetSort);

  const [queryValues, setQueryValues] = useQueryStates(filterQueryStateParsers);

  const hasActiveQueryFilters = Object.values(queryValues).some(value =>
    value !== null && (Array.isArray(value) ? value.length > 0 : true)
  );

  const activeFilter = mapQueryValuesToFilter(queryValues);

  // Once a preset is edited, the URL switches from route-driven preset state to plain query params.
  useEffect(() => {
    if (!presetName || !hasActiveQueryFilters) {
      return;
    }

    const nextSearch = serializeBrowseUrl(
      location.search,
      mergeQueryValuesWithPreset(queryValues, presetFilter, presetSort)
    );

    navigate({ pathname: "/browse", search: nextSearch }, { replace: true });
  }, [
    hasActiveQueryFilters,
    location.search,
    navigate,
    presetFilter,
    presetName,
    presetSort,
    queryValues.format,
    queryValues.genre,
    queryValues.score,
    queryValues.search,
    queryValues.season,
    queryValues.status,
    queryValues.year,
  ]);

  const removeFilter = (key: keyof AnimeFilter, value?: string) => {
    if (key === "genreIn" && value) {
      setQueryValues({ genre: removeGenreValue(queryValues.genre, value) });
    } else {
      setQueryValues({ [filterFieldToQueryKey[key]]: null });
    }
  };

  const removePresetFilter = (key: keyof AnimeFilter, value?: string) => {
    const nextSearch = serializeBrowseUrl(
      location.search,
      removeFilterValueFromQuery(presetQueryValues, key, value)
    );

    navigate({ pathname: "/browse", search: nextSearch }, { replace: true });
  };

  const resetFilter = () => {
    setQueryValues(emptyFilterQueryValues);
  };

  const resetPresetFilter = () => {
    navigate("/browse", { replace: true });
  };

  if (presetName && !hasActiveQueryFilters) {
    return {
      filter: presetFilter ?? null,
      isFilterActive: !!presetFilter,
      removeFilter: removePresetFilter,
      resetFilter: resetPresetFilter,
    };
  }

  return {
    filter: hasActiveQueryFilters ? activeFilter : null,
    isFilterActive: hasActiveQueryFilters,
    removeFilter,
    resetFilter,
  };
};
export default useFilter;