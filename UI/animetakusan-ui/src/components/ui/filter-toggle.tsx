import { Label } from "./label";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

interface FilterToggleProps {
  options: string[];
  value?: string[];
  title: string;
  className?: string;
  onChange?: (selected: string[]) => void;
}

const FilterToggle = ({ options: data, value, title, className, onChange }: FilterToggleProps) => {

  return (
    <div className={cn(className, "flex flex-col gap-3")}>
      <Label htmlFor={title}>{title}</Label>
      <ToggleGroup
        type="multiple"
        id={title}
        className="flex-wrap"
        value={value}
        onValueChange={onChange}
        variant="outline"
        spacing={2}
      >
        {
          data.map((element) => (
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