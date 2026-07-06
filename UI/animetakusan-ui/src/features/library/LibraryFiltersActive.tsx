import Chip from "@/components/ui/chip";
import type { LibraryFilter } from "@/models/filter/LibraryFilter";
import LibrarySort from "@/components/ui/library-sort";

interface FiltersActiveProps {
  filter: LibraryFilter | null;
  sort: string | null;
  setSort: (sort: string) => void;
  onRemoveFilter?: (key: keyof LibraryFilter, value: string) => void;
  onResetFilter?: () => void;
}

const categoryLabels: Record<keyof LibraryFilter, "default" | "search" | "year" | "genre" | "season" | "status" | "format" | "averageScoreGreater"> = {
  genreIn: "genre",
  status: "status",
  seasonYear: "year",
  averageScoreGreater: "averageScoreGreater",
  season: "season",
  format: "format",
  search: "search"
}

const LibraryFiltersActive = ({ filter, sort, setSort, onRemoveFilter, onResetFilter }: FiltersActiveProps) => {

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
    <div className="flex items-center justify-between mt-6 min-h-[22px]">
      <div className="group/hover flex gap-4 w-full">
        <div className="flex gap-2 flex-wrap w-fit">
          {
            filterEntries
              .map(({ key, label }) => (
                <Chip
                  onRemoveFilter={() => onRemoveFilter?.(key as keyof LibraryFilter, label)}
                  key={`${key}-${label}`}
                  variant={categoryLabels[key as keyof LibraryFilter]}
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
      <LibrarySort sort={sort ?? "Title"} onChange={setSort} />

    </div>
  )
}
export default LibraryFiltersActive;