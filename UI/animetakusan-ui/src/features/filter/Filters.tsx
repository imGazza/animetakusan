import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Container from "@/components/ui/container";
import FilterPanel from "@/components/ui/filter-panel";
import FilterSearch from "@/components/ui/filter-search";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import FiltersActive from "./FiltersActive";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";

const Filters = ({ filter, onRemoveFilter, onResetFilter }: {
  filter: AnimeFilter | null,
  onRemoveFilter?: (key: keyof AnimeFilter, value: string) => void,
  onResetFilter?: () => void
}) => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <Container className="flex flex-col gap-3 py-0 mt-6">
          <div className="flex flex-col gap-3 w-full">
            <h1 className="text-3xl font-bold tracking-tight">Browse Anime</h1>
            <div className="flex w-full gap-2">
              <FilterSearch className="flex-1" />
              <CollapsibleTrigger asChild>
                <Button size="icon" className="h-10 w-10 shrink-0" variant={isFilterOpen ? "default" : "outline"}>
                  <ListFilter />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </Container>
        <CollapsibleContent>
          <Container className="pb-0">
            <FilterPanel />
          </Container>
        </CollapsibleContent>
      </Collapsible>

      <FiltersActive currentFilters={filter} onRemoveFilter={onRemoveFilter} onResetFilter={onResetFilter} />
    </>
  )
}
export default Filters;
