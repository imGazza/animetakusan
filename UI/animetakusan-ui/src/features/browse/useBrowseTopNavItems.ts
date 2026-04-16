import { emptyFilterQueryValues, queryParamsSchema } from "@/hooks/useFilter";
import { useCallback, useMemo, type MouseEvent } from "react";
import { useLocation } from "react-router";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";

export interface BrowseTopNavItem {
  label: string;
  href: string;
  coming: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const useBrowseTopNavItems = (items: BrowseTopNavItem[]) => {
  const location = useLocation();
  const [params, setParams] = useQueryStates(queryParamsSchema);
  const [sort, setSort] = useQueryState("sort", parseAsString);

  const hasActiveBrowseState = Object.values(params).some(
    value => value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)
  ) || !!sort;

  const handleBrowseClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/browse" && hasActiveBrowseState) {
      event.preventDefault();
      setParams(emptyFilterQueryValues);
      setSort(null);
    }
  }, [hasActiveBrowseState, location.pathname, setParams, setSort]);

  return useMemo(
    () => items.map((item) => (
      item.href === "/browse" && !item.coming
        ? { ...item, onClick: handleBrowseClick }
        : item
    )),
    [handleBrowseClick, items]
  );
};

export default useBrowseTopNavItems;