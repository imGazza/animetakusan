import { format } from "date-fns";
import { X, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";

const AnimeDetailEntryDate = ({ title, date, setDate }: { title: string, date: Date | undefined, setDate: (date: Date | undefined) => void }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-muted-foreground text-sm">{title}</div>
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="w-full justify-start pr-8 text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              <span className="truncate">
                {date ? format(date, "PPP") : "Pick a date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
        {date ? (
          <Button
            variant="ghost"
            size="icon-xs"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setDate(undefined)}
            aria-label={`Clear ${title.toLowerCase()}`}
          >
            <X className="size-3.5" />
          </Button>
        ) : (
          <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
export default AnimeDetailEntryDate;