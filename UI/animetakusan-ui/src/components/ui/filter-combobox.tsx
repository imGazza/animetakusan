import React from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "./combobox";
import { Label } from "./label";

interface FilterComboboxProps {
  items: readonly string[];
  title: string;
}

const FilterCombobox = ({ items, title }: FilterComboboxProps) => {
  const anchor = useComboboxAnchor()
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="genres">{title}</Label>   
      <Combobox
      multiple
      autoHighlight
      items={items}
      onValueChange={setSelectedValues}
    >
      <ComboboxChips ref={anchor} className="w-full rounded-xs">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={selectedValues.length === 0 ? "Any" : ""} />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
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
export default FilterCombobox;