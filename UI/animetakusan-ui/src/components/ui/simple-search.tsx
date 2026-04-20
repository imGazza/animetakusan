import { Search } from "lucide-react";
import { Button } from "./button";
import { Command, CommandDialog, CommandInput, CommandList } from "./command";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useSimpleBrowseQuery } from "@/features/browse/queries";
import { useDebounce } from "use-debounce";
import CommandAnime from "./command-anime";
import type { AnimeFilter } from "@/models/filter/AnimeFilter";
import { toast } from "sonner";
import { createSerializer, parseAsString } from "nuqs";
import { useNavigate } from "react-router";

const urlSerializer = createSerializer({
  search: parseAsString,
  sort: parseAsString,
})

const SimpleSearch = ({ className }: { className?: string }) => {

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<AnimeFilter | null>({ search: "" });
  const [debouncedInput] = useDebounce(input, 300);
  const { data: browseResult, error } = useSimpleBrowseQuery(filter ?? {}, "SearchMatch", open && filter?.search !== "");  
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedInput) {
      setFilter({ search: debouncedInput });
    }
  }, [debouncedInput])

  if (error) {
    toast.error("An error occurred while searching. Please try again.");
  }

  const viewAllResults = () => {
    const url = urlSerializer('/browse', { search: debouncedInput, sort: "SearchMatch" });
    navigate(url, { replace: true });
    setOpen(false);
  }

  const animes = useMemo(
    () => browseResult?.data?.slice(0, 10) ?? [],
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
                  <div className="w-full flex justify-center"><Button variant="ghost" size="xs" onClick={viewAllResults}>View All</Button></div>
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