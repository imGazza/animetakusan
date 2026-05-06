import MobileFilterPanel from "./mobile-filter-panel";
import DesktopFilterPanel from "./desktop-filter-panel";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { FILTER_FORMATS, FILTER_GENRES, FILTER_SEASONS, FILTER_STATUSES, FILTER_YEARS } from "@/lib/filter-options";
import useMediaQuery from "@/hooks/useMediaQuery";



const FilterPanel = ({ filter }: { filter: AnimeFilter | null }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="mt-4 md:mt-6">
      {isDesktop ? (
        <DesktopFilterPanel
          genres={FILTER_GENRES}
          years={FILTER_YEARS}
          seasons={FILTER_SEASONS}
          formats={FILTER_FORMATS}
          statuses={FILTER_STATUSES}
          filter={filter}
        />
      ) : (
        <MobileFilterPanel
          genres={FILTER_GENRES}
          years={FILTER_YEARS}
          seasons={FILTER_SEASONS}
          formats={FILTER_FORMATS}
          statuses={FILTER_STATUSES}
          filter={filter}
        />
      )}
    </div>
  )
}
export default FilterPanel;