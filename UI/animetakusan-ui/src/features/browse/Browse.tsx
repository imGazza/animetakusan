import BrowseSection from "./BrowseSection";
import BrowseFilter from "./BrowseFilter";
import Container from "@/components/ui/container";
import useFilter from "@/hooks/useFilter";
import Filters from "./Filters";
import PageHeaderBlock from "@/components/ui/page-header-block";
import PageTitle from "@/components/ui/page-title";

const Browse = () => {
  const { filter, isFilterActive, sort, isSortActive, removeFilter, resetAllFilters: resetFilter } = useFilter();
  const isBrowseFilterMode = isFilterActive || isSortActive;

  return (
    <>
      <PageTitle text="Browse" />
      <Container>
        <PageHeaderBlock variant="browse" title="Browse Anime" />
        <Filters filter={isFilterActive ? filter : null} sort={sort ?? null} onRemoveFilter={removeFilter} onResetFilter={resetFilter} />
        {
          isBrowseFilterMode ? (
            <BrowseFilter key={JSON.stringify({ filter, sort })} filter={filter!} sort={sort} />
          ) :
            (
              <BrowseSection />
            )
        }
      </Container>
    </>
  )
}
export default Browse;