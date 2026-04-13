import React from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "./combobox";
import { Label } from "./label";

interface FilterComboboxProps {
  items: readonly string[];
  title: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const FilterCombobox = ({ items, title, value, onChange }: FilterComboboxProps) => {
  const anchor = useComboboxAnchor()
  


  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor={title}>{title}</Label>   
      <Combobox
      id={title}
      multiple
      autoHighlight
      items={items}
      onValueChange={onChange}
      value={value}
    >
      <ComboboxChips ref={anchor} className="w-full rounded-xs">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={value && value.length === 0 ? "Any" : ""} />
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