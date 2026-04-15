import BrowseSection from "./BrowseSection";
import BrowseFilter from "./BrowseFilter";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";
import Filters from "../filter/Filters";
import { useLocation } from "react-router";

const Browse = () => {

  const { filter, isFilterActive, removeFilter, resetFilter } = useFilter();
  const { sort, isSortActive } = useSort();
  const location = useLocation();

  return (
    <>
      <Filters filter={isFilterActive ? filter : null} onRemoveFilter={removeFilter} onResetFilter={resetFilter} />
      {
        isFilterActive || isSortActive ? (
          <BrowseFilter key={JSON.stringify({ filter, sort })} filter={filter!} sort={sort} />
        ) :
          (
            <BrowseSection key={location.pathname + location.search} />
          )
      }
    </>
  )
}
export default Browse;