import { useState } from "react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./combobox";
import { Label } from "./label"
interface FilterSelectProps {
  items: readonly string[];
  title: string;
}

const FilterSelect = ({ items, title }: FilterSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="genres">{title}</Label>
      <Combobox
        autoHighlight
        items={items}
        onValueChange={(value: string | null) => setSelectedValue(value)}
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
