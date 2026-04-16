import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSeasonsItem {
  icon: LucideIcon;
  value: string;
  selectedColor: string;
}

interface FilterSeasonsProps {
  title: string;
  options: FilterSeasonsItem[];
  value?: string | null;
  onChange?: (selected: string | null) => void;
  className?: string;
}

const FilterSeasons = ({ title, options, value, onChange, className }: FilterSeasonsProps) => {
  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <div className="text-sm">{title}</div>
      <ToggleGroup
        type="single"
        value={value ?? ""}
        onValueChange={(selected) => onChange?.(selected || null)}
        size="sm"
        spacing={2}
        variant="outline"
      >
        {
          options.map((element) => (
            <ToggleGroupItem key={element.value} value={element.value} aria-label={element.value} className="capitalize text-xs data-[state=on]:bg-muted" style={value === element.value ? { color: element.selectedColor } : undefined}>
              <element.icon />
              {element.value}
            </ToggleGroupItem>
          ))
        }
      </ToggleGroup>
    </div>
  )
}
export default FilterSeasons