import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

const FilterSearch = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full", className)}>
      <InputGroup className="rounded-xs h-full">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
export default FilterSearch;