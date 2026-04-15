import React from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "./combobox";

interface FilterComboboxProps {
  items: readonly string[];
  title: string;
  value?: string[] | null;
  onChange?: (value: string[] | null) => void;
}

const FilterCombobox = ({ items, title, value, onChange }: FilterComboboxProps) => {
  const anchor = useComboboxAnchor()
  


  return (
    <div className="flex flex-col gap-2 w-full">
      <div>{title}</div>
      <Combobox
      multiple
      autoHighlight
      items={items}
      onValueChange={(selected) => onChange?.(selected.length > 0 ? selected : null)}
      value={value ?? []}
    >
      <ComboboxChips ref={anchor} className="w-full rounded-xs">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={!value || value.length === 0 ? "Any" : ""} />
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