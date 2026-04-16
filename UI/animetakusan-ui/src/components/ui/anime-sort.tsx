import useSortMap from "@/hooks/useSortMap";
import { ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { parseAsString, useQueryState } from "nuqs";

const AnimeSort = ({ sort }: { sort?: string }) => {
  const { getSortName, sortMap } = useSortMap();
  const [, setSort] = useQueryState("sort", parseAsString);

  return (
    <div className="w-full flex justify-end cursor-pointer">
      <Popover>
        <PopoverTrigger asChild>
          <div className="text-muted-foreground text-xs flex gap-2">
            <ArrowUpDown className="size-4" />
            {getSortName(sort || "PopularityDesc")}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-fit border-none rounded-xs mt-2 p-2.5">
          <div className="flex flex-col gap-2">
            {
              Object.entries(sortMap).map(([key, value]) => (
                <Button
                  onClick={() => setSort(key)}
                  variant="ghost"
                  key={key}
                  className="text-muted-foreground text-xs p-1 items-center justify-start"
                >
                  {value}
                </Button>
              ))
            }
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
export default AnimeSort;