import type { LibraryFilter } from "@/models/filter/LibraryFilter";
import { useState } from "react";

const useLibraryFilter = () => {
  
  const [filter, setFilter] = useState<LibraryFilter | null>(null);
  const [sort, setSort] = useState<string>("Title");

  const addFilter = <K extends keyof LibraryFilter>(key: K, value: LibraryFilter[K]) => {    
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  }

  const removeFilter = (key: keyof LibraryFilter) => {
    if (!filter) return;

    setFilter({
      ...filter,
      [key]: null
    });
  }

  const resetAllFilters = () => {
    setFilter(null);
    setSort("Title");
  }

  const isFilterActive = Object.values(filter ?? {}).some(value => value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0));

  return {
    filter: isFilterActive ? filter : null,
    sort,
    addFilter,
    setSort,
    removeFilter,
    resetAllFilters
  }
}
export default useLibraryFilter;