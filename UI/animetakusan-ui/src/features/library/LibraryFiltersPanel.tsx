import { FILTER_FORMATS, FILTER_GENRES, FILTER_SEASONS, FILTER_STATUSES, FILTER_YEARS } from "@/lib/filter-options";
import useMediaQuery, { DESKTOP_BREAKPOINT } from "@/hooks/useMediaQuery";
import LibraryDesktopFilterPanel from "@/components/ui/library-desktop-filter-panel";
import LibraryMobileFilterPanel from "@/components/ui/library-mobile-filter-panel";
import type { LibraryFilter } from "@/models/filter/LibraryFilter";

const LibraryFiltersPanel = ({ filter, addFilter }: { filter: LibraryFilter | null, addFilter: <K extends keyof LibraryFilter>(key: K, value: LibraryFilter[K]) => void }) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  return (
    <div className="mt-4 md:mt-6">
      {isDesktop ? (
        <LibraryDesktopFilterPanel
          genres={FILTER_GENRES}
          years={FILTER_YEARS}
          seasons={FILTER_SEASONS}
          formats={FILTER_FORMATS}
          statuses={FILTER_STATUSES}
          filter={filter}
          addFilter={addFilter}
        />
      ) : (
        <LibraryMobileFilterPanel
          genres={FILTER_GENRES}
          years={FILTER_YEARS}
          seasons={FILTER_SEASONS}
          formats={FILTER_FORMATS}
          statuses={FILTER_STATUSES}
          filter={filter}
          addFilter={addFilter}
        />
      )}
    </div>
  )
}
export default LibraryFiltersPanel;