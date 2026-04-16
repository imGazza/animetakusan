import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

interface FilterToggleProps {
  options: string[];
  value?: string[] | null;
  title: string;
  className?: string;
  onChange?: (selected: string[] | null) => void;
}

const FilterToggle = ({ options, value, title, className, onChange }: FilterToggleProps) => {

  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <div className="text-sm">{title}</div>
      <ToggleGroup
        type="multiple"
        className="flex-wrap"
        value={value ?? []}
        onValueChange={(selected) => onChange?.(selected.length > 0 ? selected : null)}
        variant="outline"
        spacing={2}
      >
        {
          options.map((element) => (
            <ToggleGroupItem key={element} value={element} variant="outline" size="sm" className="shrink-0 text-xs data-[state=on]:border-accent">
              {element}
            </ToggleGroupItem>
          ))
        }
      </ToggleGroup>
    </div>
  )
}
export default FilterToggle;