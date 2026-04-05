import { presetFilters } from "@/lib/preset-filters";
import { parseAsString, useQueryStates } from "nuqs";
import { useParams } from "react-router";

const useSort = () => {
  const { preset } = useParams<{ preset?: string }>();

  const [params] = useQueryStates({
    sort: parseAsString,
  });

  if (preset) {
    const presetSort = presetFilters.find(p => p.name === preset)?.sort ?? null;
    return { isSortActive: !!presetSort, sort: presetSort ?? undefined };
  }

  const sort = params.sort ?? undefined;
  return { isSortActive: !!sort, sort };
}
export default useSort;