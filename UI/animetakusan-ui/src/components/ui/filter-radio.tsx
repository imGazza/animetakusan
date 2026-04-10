import { useState } from "react";
import { Label } from "./label"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { cn } from "@/lib/utils";

interface FilterRadioProps {
  title: string;
  data: string[];
  className?: string;
}

const FilterRadio = ({ title, data, className }: FilterRadioProps) => {

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
        size="sm"
        spacing={2}
        variant="outline"
        className="md:flex-wrap"
      >
        {
          data.map((element) => (
            <ToggleGroupItem key={element} value={element} aria-label={element} className="text-xs">
              {element}
            </ToggleGroupItem>
          ))
        }
      </ToggleGroup>
    </div>
  )
}
export default FilterRadio