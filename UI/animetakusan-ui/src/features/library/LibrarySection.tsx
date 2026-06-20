import AnimeCard, { AnimeCardSkeleton } from '@/components/ui/anime-card'
import AnimeCardProgress from '@/components/ui/anime-card-progress'
import AnimeDisplay from '@/components/ui/anime-display'
import LibrarySortInfo from '@/components/ui/library-sort-info'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnimeList } from '@/models/library/UserLibrary'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'


interface LibrarySectionProps {
  list: AnimeList,
  sort: string,
  visibleCount: number
  onLoadMore: () => void
}

const LibrarySection = ({ list, sort, visibleCount, onLoadMore }: LibrarySectionProps) => {

  const { ref, inView } = useInView({ rootMargin: '800px' });
  const hasMore = visibleCount < list.entries.length
  const visibleEntries = list.entries.slice(0, visibleCount)

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore])


  return (
    <div className="flex flex-col gap-4">
      <div className="text-md font-semibold text-muted-foreground tracking-wider">{list.name}</div>

      <AnimeDisplay>
        {visibleEntries.map(entry => (
          <div key={entry.anime.id} className="flex flex-col w-full max-w-(--sm-image-width) md:max-w-(--md-image-width)">
            <AnimeCard anime={entry.anime} />
            { list.name === "Watching" && <AnimeCardProgress anime={entry.anime} />}
            { list.name !== "Watching" && <LibrarySortInfo anime={entry.anime} sort={sort} /> }
          </div>
        ))}
      </AnimeDisplay>
      <div ref={ref} className="h-1" aria-hidden="true" />
    </div>
  )
}
export default LibrarySection;

export const LibrarySectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-40 text-md font-semibold text-muted-foreground tracking-wider" />

      <AnimeDisplay>
        {Array.from({ length: 20 }).map((_, index) => (
          <AnimeCardSkeleton key={index} />
        ))}
      </AnimeDisplay>
    </div>
  )
}