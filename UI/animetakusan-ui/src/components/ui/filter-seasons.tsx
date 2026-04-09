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
  data: FilterSeasonsItem[];
  className?: string;
}

const FilterSeasons = ({ title, data, className }: FilterSeasonsProps) => {

  const [value, setValue] = useState("");

  const changeValue = (value: string) => {
    console.log(value);
    // Logic to set filter
    setValue(value);
  }

  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <Label htmlFor="filter">{title}</Label>
      <ToggleGroup
        id="filter"
        type="single"
        value={value}
        onValueChange={(value) => changeValue(value)}
        className="border rounded-md p-0.5"
        size="default"
        spacing={1}
      >
        {
          data.map((element) => (
            <ToggleGroupItem key={element.value} value={element.value} aria-label={element.value} className="data-[state=on]:bg-muted" style={value === element.value ? { color: element.selectedColor } : undefined}>
              <element.icon />
            </ToggleGroupItem>
          ))
        }
      </ToggleGroup>
    </div>
  )
}
export default FilterSeasons