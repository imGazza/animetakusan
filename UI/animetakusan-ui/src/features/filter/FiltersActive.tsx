import Chip from "@/components/ui/chip";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import AnimeSort from "@/components/ui/anime-sort";

// TODO: Evaluate the possibility of unifing the different filters (FilterToggle FilterRadio)

interface FiltersActiveProps {
  filter: AnimeFilter | null;
  sort: string | null;
  onRemoveFilter?: (key: keyof AnimeFilter, value: string) => void;
  onResetFilter?: () => void;
}

const categoryLabels: Record<keyof AnimeFilter, "default" | "search" | "year" | "genre" | "season" | "status" | "format" | "averageScoreGreater"> = {
  genreIn: "genre",
  status: "status",
  seasonYear: "year",
  averageScoreGreater: "averageScoreGreater",
  season: "season",
  format: "format",
  search: "search"
}

const FiltersActive = ({ filter, sort, onRemoveFilter, onResetFilter }: FiltersActiveProps) => {

  if (!filter && !sort) return null;

  // Removes the undefined values of filters
  // FlatMap is used to normalize array values like Genre
  // String is used to convert the numeric values of certain filters like Year and Score
  // Example of result:
  // [
  //   { key: "format", label: "TV" },
  //   { key: "genreIn", label: "Action" },   // flattened from the inner array
  //   { key: "genreIn", label: "Comedy" },   // flattened from the inner array
  //   { key: "status", label: "RELEASING" },
  // ]
  const filterEntries = filter ? Object.entries(filter)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(v => ({ key, label: String(v).toLowerCase() }))
        : [{ key, label: String(value).toLowerCase() }]
    ) : [];

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="group/hover flex gap-4 w-full">
        <div className="flex gap-2 flex-wrap w-fit">
          {
            filterEntries
              .map(({ key, label }) => (
                <Chip
                  onRemoveFilter={() => onRemoveFilter?.(key as keyof AnimeFilter, label)}
                  key={`${key}-${label}`}
                  variant={categoryLabels[key as keyof AnimeFilter]}
                  className="capitalize">
                  {key === 'averageScoreGreater' ? `≥ ${label}%` : label}
                </Chip>
              ))
          }
        </div>
        {
          filter ?
            <Chip variant="default" className="flex md:hidden md:group-hover/hover:flex" onRemoveFilter={onResetFilter}>
              Clear All
            </Chip> : null
        }
      </div>
      <AnimeSort sort={sort ?? "PopularityDesc"} />

    </div>
  )
}
export default FiltersActive;