import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from "nuqs";
import { useParams } from "react-router";
import { presetFilters } from "@/lib/preset-filters";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";

const useFilter = (): { filter: AnimeFilter | null; isFilterActive: boolean } => {
  const { preset } = useParams<{ preset?: string }>();

  const [params] = useQueryStates({
    season: parseAsString,
    year:   parseAsInteger,
    format: parseAsString,
    search: parseAsString,
    status: parseAsString,
    score:  parseAsInteger,
    genre:  parseAsArrayOf(parseAsString)
  });

  if (preset) {
    const presetFilter = presetFilters.find(p => p.name === preset)?.filter ?? null;
    return { filter: presetFilter, isFilterActive: !!presetFilter };
  }

  const filter: AnimeFilter = {
    season:               params.season   ?? undefined,
    seasonYear:           params.year     ?? undefined,
    format:               params.format   ?? undefined,
    search:               params.search   ?? undefined,
    status:               params.status   ?? undefined,
    averageScoreGreater:  params.score    ?? undefined,
    genreIn:              params.genre    ?? undefined,
  };

  const isFilterActive = Object.values(filter).some(v =>
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );

  return { filter: isFilterActive ? filter : null, isFilterActive };
};

export default useFilter;