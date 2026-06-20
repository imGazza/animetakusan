import Container from '@/components/ui/container';
import { useLibraryQuery } from './queries';
import { useLibraryInfiniteScroll } from '@/hooks/useLibraryInfiniteScroll';
import LibrarySection, { LibrarySectionSkeleton } from './LibrarySection';
import useLibraryFilter from '@/hooks/useLibraryFilter';
import LibraryFilters from './LibraryFilters';
import PageHeaderBlock from '@/components/ui/page-header-block';
import { useAuth } from '@/hooks/useAuth';
import useDeferredRendering from '@/hooks/useDeferredRendering';
import { useFilteredLibrary } from '@/hooks/useFilteredLibrary';
import { useEffect } from 'react';

export function Library() {

  const { data: library, isLoading, error } = useLibraryQuery();
  const { filter, sort, addFilter, setSort, removeFilter, resetAllFilters } = useLibraryFilter();
  const isReady = useDeferredRendering(library);
  const { user } = useAuth();

  const filteredLists = useFilteredLibrary(library ?? null, filter, sort)?.lists ?? library?.lists ?? [];

  const { visibleCounts, loadMore, resetVisibleCounts } = useLibraryInfiniteScroll(filteredLists);

  useEffect(() => {
    if(!isReady) return;

    resetVisibleCounts();
  }, [filter, sort, resetVisibleCounts, isReady]);
  
  return (
    <Container className="">
      <PageHeaderBlock variant="library" title={localStorage.getItem('user') ? `${localStorage.getItem('user')}'s Library` : user?.userName ? `${user.userName}'s Library` : "User's Library"} />

      <LibraryFilters
        filter={filter}
        sort={sort}
        addFilter={addFilter}
        setSort={setSort}
        onRemoveFilter={removeFilter}
        onResetFilter={resetAllFilters}
      />
      <div className="flex flex-col gap-6 mt-4">
        {
          isLoading || !isReady ? (
            <LibrarySectionSkeleton />
          ) : (
            filteredLists.map(list => (
              list.entries.length > 0 &&
              <LibrarySection
                key={list.name}
                list={list}
                sort={sort}
                visibleCount={visibleCounts[list.name] ?? 12}
                onLoadMore={() => loadMore(list.name)}
              />
            ))
          )
        }
      </div>
    </Container>
  )
}
export default Library;