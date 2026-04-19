import { Search } from "lucide-react";
import { Button } from "./button";
import { Command, CommandDialog, CommandInput, CommandList } from "./command";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useBrowseQuery } from "@/features/browse/queries";
import { useDebounce } from "use-debounce";
import CommandAnime from "./command-anime";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { toast } from "sonner";

const SimpleSearch = ({ className }: { className?: string }) => {

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<AnimeFilter | null>({ search: "" });
  const { data: browseResult, error } = useBrowseQuery(filter ?? {}, "SearchMatch");
  const [debouncedInput] = useDebounce(input, 300);

  useEffect(() => {
    if (debouncedInput) {
      setFilter({ search: debouncedInput });
    }
  }, [debouncedInput])

  if (error) {
    toast.error("An error occurred while searching. Please try again.");
  }

  const animes = useMemo(
    () => browseResult?.pages.flatMap(page => page.data).slice(0, 10) ?? [],
    [browseResult]
  );

  return (
    <div className={cn("flex-col gap-4", className)}>
      <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <Search className="size-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false} className="top-1/9 bg-transparent shadow-none border-none">
        <Command className="bg-muted/90">
          <CommandInput placeholder="Search for an anime..." onValueChange={setInput} />
          <div className="text-xs p-1 text-muted-foreground text-end">Quickly browse for an anime</div>
        </Command>

        {
          debouncedInput && animes.length > 0 ? (
            <Command className="bg-muted/90 text-muted-foreground p-4 h-full">
              <CommandList className="max-h-full">
                <div className="flex flex-col gap-4 h-full">
                  {animes.map(anime => (
                    <CommandAnime key={anime.id} anime={anime} />
                  ))}
                  <div className="w-full flex justify-center"><Button variant="ghost" size="xs">View All</Button></div>
                </div>
              </CommandList>
            </Command>
          ) : null
        }

      </CommandDialog>
    </div>
  )
}
export default SimpleSearch;