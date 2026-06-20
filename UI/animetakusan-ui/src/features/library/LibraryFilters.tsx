import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import LibraryFilterSearch from "@/components/ui/library-filter-search";
import type { LibraryFilter } from "@/models/filter/LibraryFilter";
import { ListFilter } from "lucide-react"
import { useState } from "react";
import LibraryFiltersPanel from "./LibraryFiltersPanel";
import LibraryFiltersActive from "./LibraryFiltersActive";

const LibraryFilters = ({ filter, sort, addFilter, setSort, onRemoveFilter, onResetFilter } : { filter: LibraryFilter | null, sort: string, addFilter: <K extends keyof LibraryFilter>(key: K, value: LibraryFilter[K]) => void, setSort: (sort: string) => void, onRemoveFilter?: (key: keyof LibraryFilter, value: string) => void, onResetFilter?: () => void }) => {
    
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  return (
    <>
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="flex flex-col gap-3 py-0">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex w-full gap-2">
              <LibraryFilterSearch className="flex-1" search={filter?.search ?? ""} onChange={(value) => addFilter("search", value)} />
              <CollapsibleTrigger asChild>
                <Button size="icon" className="h-10 w-10 shrink-0" variant={isFilterOpen ? "default" : "outline"}>
                  <ListFilter />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        <CollapsibleContent>
          <div className="pb-0">
            <LibraryFiltersPanel filter={filter} addFilter={addFilter} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <LibraryFiltersActive filter={filter} sort={sort} setSort={setSort} onRemoveFilter={onRemoveFilter} onResetFilter={onResetFilter} />
    </>
  )
}
export default LibraryFilters