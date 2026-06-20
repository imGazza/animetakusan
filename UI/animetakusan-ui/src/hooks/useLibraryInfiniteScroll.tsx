import type { AnimeList } from '@/models/library/UserLibrary'
import { useState, useCallback } from 'react'

const INITIAL_COUNT = 12
const PAGE_SIZE = 20

export function useLibraryInfiniteScroll(lists: AnimeList[]) {
  
  // Create objects like { "Watching": 20, "Completed": 20 } to track how many items are visible for each list
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(lists.map(l => [l.name, INITIAL_COUNT]))
  )

  // Updates values in visibleCounts to show more items for the given list name (checking if it doesn't exceed the total number of items in that list)
  const loadMore = useCallback((listName: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [listName]: Math.min(
        (prev[listName] ?? INITIAL_COUNT) + PAGE_SIZE,
        lists.find(l => l.name === listName)?.entries.length ?? 0
      ),
    }))
  }, [lists])

  const resetVisibleCounts = useCallback(() => {
    setVisibleCounts(Object.fromEntries(lists.map(l => [l.name, INITIAL_COUNT])))
  }, [lists])

  return { visibleCounts, loadMore, resetVisibleCounts }
}