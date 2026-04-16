import MobileFilterPanel from "./mobile-filter-panel";
import DesktopFilterPanel from "./desktop-filter-panel";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { FILTER_FORMATS, FILTER_GENRES, FILTER_SEASONS, FILTER_STATUSES, FILTER_YEARS } from "@/lib/filter-options";
import { useEffect, useState } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const getIsDesktop = () =>
  typeof window !== "undefined" && window.matchMedia(DESKTOP_MEDIA_QUERY).matches;

const FilterPanel = ({ filter }: { filter: AnimeFilter | null }) => {
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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