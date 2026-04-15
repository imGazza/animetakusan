import { Search } from "lucide-react";
import { Button } from "./button";
import { Command, CommandDialog, CommandEmpty, CommandInput, CommandList } from "./command";
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
        <Command className="bg-muted/90">
          <CommandInput placeholder="Search for an anime..." />
          <div className="text-xs p-1 text-muted-foreground text-end">Quickly browse for an anime</div>
        </Command>

        <Command className="bg-muted/90 text-muted-foreground">
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>            
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
export default SimpleSearch;