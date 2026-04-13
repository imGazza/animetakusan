import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./combobox";
import { Label } from "./label"

interface FilterSelectProps {
  items: readonly string[];
  title: string;  
  value?: string;
  onChange?: (value: string) => void;
}

const FilterSelect = ({ items, title, value, onChange }: FilterSelectProps) => {
  

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={title}>{title}</Label>
      <Combobox
        id={title}
        autoHighlight
        items={items}
        onValueChange={(value) => onChange?.(value ?? '')}
        value={value}
      >
        <ComboboxInput placeholder="Any" className="rounded-xs" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
export default FilterSelect;
