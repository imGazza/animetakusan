import BrowseSection from "./BrowseSection";
import BrowseFilter from "./BrowseFilter";
import useFilter from "@/hooks/useFilter";

const Browse = () => {
    
  const { filter, isFilterActive } = useFilter();

  return (
    <>
      {
        isFilterActive ? (
          <BrowseFilter filter={filter!} />
        ) : 
        (
          <BrowseSection />
        )
      }
    </>
  )
}
export default Browse;