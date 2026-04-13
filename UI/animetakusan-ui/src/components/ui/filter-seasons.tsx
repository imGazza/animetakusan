import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { type LucideIcon } from "lucide-react";
import { Label } from "./label";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterSeasonsItem {
  icon: LucideIcon;
  value: string;
  selectedColor: string;
}

interface FilterSeasonsProps {
  title: string;
  options: FilterSeasonsItem[];
  value?: string;
  onChange?: (selected: string) => void;
  className?: string;
}

const FilterSeasons = ({ title, options: data, value, onChange, className }: FilterSeasonsProps) => {

  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <Label htmlFor="filter">{title}</Label>
      <ToggleGroup
        id="filter"
        type="single"
        value={value}
        onValueChange={onChange}
        size="sm"
        spacing={2}
        variant="outline"
      >
        {
          data.map((element) => (
            <ToggleGroupItem key={element.value} value={element.value} aria-label={element.value} className="text-xs data-[state=on]:bg-muted" style={value === element.value ? { color: element.selectedColor } : undefined}>
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