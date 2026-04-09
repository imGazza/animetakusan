import { Toggle } from "./toggle";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FilterToggleProps {
  data: string[];
  title: string;
  className?: string;
}

const FilterToggle = ({ data, title, className }: FilterToggleProps) => {

  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <Label htmlFor="filter">{title}</Label>
      <div id="filter" className="flex max-md:overflow-x-auto max-md:touch-pan-x md:flex-wrap scrollbar-none [&::-webkit-scrollbar]:hidden gap-2 pb-1">
        {
          data.map((element) => (
            <Toggle key={element} variant="outline" size="sm" className="shrink-0 text-xs data-[state=on]:border-accent">
              {element}
            </Toggle>
          ))
        }
      </div>
    </div>
  )
}
export default FilterToggle;