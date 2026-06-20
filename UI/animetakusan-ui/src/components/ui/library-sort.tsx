import { ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import useLibrarySortMap from "@/hooks/useLibrarySortMap";

const LibrarySort = ({ sort, onChange }: { sort?: string, onChange?: (sort: string) => void }) => {
  const { getSortName, sortMap } = useLibrarySortMap();

  return (
    <div className="w-full flex justify-end cursor-pointer">
      <Popover>
        <PopoverTrigger asChild>
          <div className="text-muted-foreground text-xs flex gap-2">
            <ArrowUpDown className="size-4" />
            {getSortName(!sort ? "Title" : sort)}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-fit border-none rounded-xs mt-2 p-2.5">
          <div className="flex flex-col gap-2">
            {
              Object.entries(sortMap).map(([key, value]) => (
                <Button
                  onClick={() => onChange?.(key)}
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
export default LibrarySort;