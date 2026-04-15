import Container from "@/components/ui/container";
import Chip from "@/components/ui/chip";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";

// TODO: Evaluate the possibility of unifing the different filters (FilterToggle FilterSelect)

interface FiltersActiveProps {
  filter: AnimeFilter | null;
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

const FiltersActive = ({ filter, onRemoveFilter, onResetFilter }: FiltersActiveProps) => {

  if (!filter) return null;

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
  const filterEntries = Object.entries(filter)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(v => ({ key, label: String(v).toLowerCase() }))
        : [{ key, label: String(value).toLowerCase() }]
    );

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">Active Filters:</span>
        <div className="group/hover flex gap-4">
          <div className="flex gap-2 flex-wrap">
            {
              filterEntries
                .map(({ key, label }) => (
                  <Chip
                    onRemoveFilter={() => onRemoveFilter?.(key as keyof AnimeFilter, label)}
                    key={`${key}-${label}`}
                    variant={categoryLabels[key as keyof AnimeFilter]}
                    className="capitalize">
                    { key === 'averageScoreGreater' ? `≥ ${label}%` : label}
                  </Chip>
                ))
            }
          </div>
          <Chip variant="default" className="flex md:hidden md:group-hover/hover:flex" onRemoveFilter={onResetFilter}>
            Clear All
          </Chip>
        </div>
      </div>
    </Container>
  )
}
export default FiltersActive;