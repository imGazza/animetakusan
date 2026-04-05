import BrowseSection from "./BrowseSection";
import BrowseFilter from "./BrowseFilter";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";

const Browse = () => {
    
  const { filter, isFilterActive } = useFilter();
  const { sort, isSortActive } = useSort();

  return (
    <>
      {
        isFilterActive || isSortActive ? (
          <BrowseFilter filter={filter!} sort={sort} />
        ) : 
        (
          <BrowseSection />
        )
      }
    </>
  )
}
export default Browse;