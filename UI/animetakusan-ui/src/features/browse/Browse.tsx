import BrowseSection from "./BrowseSection";
import BrowseFilter from "./BrowseFilter";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";
import Filters from "../filter/Filters";

const Browse = () => {
    
  const { filter, isFilterActive } = useFilter();
  const { sort, isSortActive } = useSort();

  return (
    <>
      <Filters />
      <div className="mt-4 md:mt-10">
        {
          isFilterActive || isSortActive ? (
            <BrowseFilter filter={filter!} sort={sort} />
          ) :
          (
            <BrowseSection />
          )
        }
      </div>
    </>
  )
}
export default Browse;