import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./combobox";

interface FilterSelectProps {
  items: readonly string[];
  title: string;  
  value?: string | null;
  onChange?: (value: string | null) => void;
}

const FilterSelect = ({ items, title, value, onChange }: FilterSelectProps) => {
  

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-sm">{title}</div>
      <Combobox
        autoHighlight
        items={items}
        onValueChange={(value) => onChange?.(value ?? null)}
        value={value ?? null}
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
