import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { cn } from "@/lib/utils";

interface FilterRadioProps {
  title: string;
  options: string[];
  value?: string | null;
  className?: string;
  onChange?: (selected: string | null) => void;
}

const FilterRadio = ({ title, options, className, value, onChange }: FilterRadioProps) => { 

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
        className="md:flex-wrap"
      >
        {
          options.map((element) => (
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