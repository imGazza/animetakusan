import Container from '@/components/ui/container';
import { useLibraryQuery } from './queries';
import { useLibraryInfiniteScroll } from '@/hooks/useLibraryInfiniteScroll';
import LibrarySection, { LibrarySectionSkeleton } from './LibrarySection';
import useLibraryFilter from '@/hooks/useLibraryFilter';
import LibraryFilters from './LibraryFilters';
import PageHeaderBlock from '@/components/ui/page-header-block';
import useDeferredRendering from '@/hooks/useDeferredRendering';
import { useFilteredLibrary } from '@/hooks/useFilteredLibrary';
import { useEffect } from 'react';
import useLinkedAccounts from '@/hooks/useLinkedAccounts';

export function Library() {

  const { data: library, isLoading, error } = useLibraryQuery();
  const { filter, sort, addFilter, setSort, removeFilter, resetAllFilters } = useLibraryFilter();
  const isReady = useDeferredRendering(library);
  const { linkedAccounts } = useLinkedAccounts();

  const filteredLists = useFilteredLibrary(library ?? null, filter, sort)?.lists ?? library?.lists ?? [];

  const { visibleCounts, loadMore, resetVisibleCounts } = useLibraryInfiniteScroll(filteredLists);

  useEffect(() => {
    if (!isReady) return;

    resetVisibleCounts();
  }, [filter, sort, resetVisibleCounts, isReady]);

  return (
    <Container className="animate-in fade-in duration-300">
      <PageHeaderBlock variant="library" title={localStorage.getItem('user') ? `${localStorage.getItem('user')}'s Library` : "User's Library"} />

      {
        linkedAccounts.includes("AniList") ? (
          <>
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
          </>) : (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xs border border-dashed py-16 text-center">
            <p className="max-w-sm text-balance text-muted-foreground">
              Connect your AniList account to view your library.
            </p>
          </div>
        )
      }


    </Container>
  )
}
export default Library;