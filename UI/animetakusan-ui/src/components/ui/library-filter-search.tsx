import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { useEffect } from "react";

const LibraryFilterSearch = ({ search, onChange, className }: { search: string; onChange: (value: string) => void; className?: string }) => { 

  useEffect(() => {
    if (!search) {
      onChange("");
    }
  }, [search]);

  return (
    <div className={cn("w-full", className)}>
      <InputGroup className="rounded-xs h-full">
        <InputGroupInput
          name="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
export default LibraryFilterSearch;