import { Label } from "./label"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"
import { cn } from "@/lib/utils";

interface FilterRadioProps {
  title: string;
  options: string[];
  value?: string;
  className?: string;
  onChange?: (selected: string) => void;
}

const FilterRadio = ({ title, options: data, className, value, onChange }: FilterRadioProps) => {

  

  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <Label htmlFor={title}>{title}</Label>
      <ToggleGroup
        id={title}
        type="single"
        value={value}
        onValueChange={onChange}
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