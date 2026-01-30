import { Search } from "lucide-react";
import { Button } from "./button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SimpleSearch = ({ className }: { className?: string }) => {

  const [open, setOpen] = useState(false);

  return (   

    <div className={cn("flex-col gap-4", className)}>
      <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <Search className="size-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false} className="bg-transparent shadow-none border-none">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search for an anime..." />
          Pippo
        </Command>

        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
export default SimpleSearch;