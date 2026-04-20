import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { parseAsString, useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

const FilterSearch = ({ className }: { className?: string }) => {

  const [search, setSearch] = useQueryState('search', parseAsString);
  const [inputValue, setInputValue] = useState(search || '');
  const [debouncedValue] = useDebounce(inputValue, inputValue ? 300 : 0);

  useEffect(() => {
    setSearch(debouncedValue || null);
  }, [debouncedValue]);

  useEffect(() => {
    if (!search) {
      setInputValue('');
    }
  }, [search]);

  return (
    <div className={cn("w-full", className)}>
      <InputGroup className="rounded-xs h-full">
        <InputGroupInput
          name="search"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
export default FilterSearch;