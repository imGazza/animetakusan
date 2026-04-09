import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

const FilterSearch = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input id="search" className="pl-9 h-10" placeholder="Search anime..." />
    </div>
  );
};
export default FilterSearch;