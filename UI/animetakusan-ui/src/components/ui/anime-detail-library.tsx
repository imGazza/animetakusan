import { useState } from "react";
import { SquarePen, BookmarkPlus, BookCheck, Play, Pause, Clock3, X, Repeat, Plus, Minus, ChevronDownIcon } from "lucide-react";
import { Button } from "./button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import type { Anime } from "@/models/common/Anime";
import { displayAnimeEntryStatus } from "@/models/common/AnimeEntryStatus";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./item";
import { cn, createDateFromDetails } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { format } from "date-fns";

const animeMediaStatusOptions = [
  { value: "PLANNING", label: "Planning", icon: Clock3 },
  { value: "CURRENT", label: "Watching", icon: Play },
  { value: "COMPLETED", label: "Completed", icon: BookCheck },
  { value: "PAUSED", label: "Paused", icon: Pause },
  { value: "DROPPED", label: "Dropped", icon: X },
  { value: "REPEATING", label: "Repeating", icon: Repeat },
]

// TODO: clone the mediaListEntry data into local state and only update on submit

const AnimeDetailLibrary = ({ anime }: { anime: Anime }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    anime?.mediaListEntry?.status ?? null
  );

  if (!anime) {
    return <div>Anime not found</div>
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xs border-1 gap-2 px-3"
          style={{
            color: anime.coverImage.color,
            backgroundColor: `color-mix(in srgb, ${anime.coverImage.color} 15%, transparent)`,
            borderColor: `color-mix(in srgb, ${anime.coverImage.color} 60%, transparent)`,
          }}
        >
          {
            anime.mediaListEntry ? (
              <>
                <SquarePen className="shrink-0" />
                <span className="font-medium">{displayAnimeEntryStatus(anime.mediaListEntry.status)}</span>
                {
                  anime.mediaListEntry.progress !== 0 ? (
                    <>
                      <span className="opacity-60 text-xs">|</span>
                      <span className="opacity-80 text-xs">Ep {anime.mediaListEntry.progress} / {anime.episodes || "?"}</span>
                    </>
                  ) : null
                }
              </>
            ) : (
              <>
                <BookmarkPlus className="shrink-0" />
                Add to Library
              </>
            )
          }
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{anime.title.english || anime.title.romaji || ""}</DrawerTitle>
          <DrawerDescription>Edit library entry</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 flex flex-col gap-6">

          {/* ENTRY STATUS */}

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm">Status</div>
            <div className="grid grid-cols-3 gap-2">
              {animeMediaStatusOptions.map(option => {
                const isSelected = selectedStatus === option.value;
                return (
                  <Item
                    key={option.value}
                    variant="outline"
                    className={cn(
                      "rounded-xs cursor-pointer transition-colors hover:bg-muted/80",
                      isSelected && "bg-accent/10 border-accent text-accent-foreground"
                    )}
                    onClick={() => setSelectedStatus(option.value)}
                  >
                    <ItemContent className="items-center">
                      <ItemTitle>
                        <option.icon className="size-5" />
                      </ItemTitle>
                      <ItemDescription className={cn(isSelected && "text-accent")}>
                        {option.label}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                );
              })}
            </div>
          </div>

          {/* EPISODES */}

          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm">Episodes progress</div>
            <InputGroup className="rounded-xs">
              <InputGroupAddon align="inline-start">
                <InputGroupButton
                  aria-label="Copy"
                  title="Copy"
                  size="icon-xs"
                  onClick={() => { }}
                >
                  <Minus />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput className="text-center" value={anime.mediaListEntry?.progress ?? 0} />
              <InputGroupAddon align="inline-end">
                <div className="text-muted-foreground/60">
                  {`/ ${anime.episodes || "?"}`}
                </div>
                <InputGroupButton
                  size="icon-xs"
                  onClick={() => { }}
                >
                  <Plus />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* DATES */}

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="text-muted-foreground text-sm">Started On</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!createDateFromDetails(anime.mediaListEntry?.startedAt ?? null)}
                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {createDateFromDetails(anime.mediaListEntry?.startedAt ?? null) ? format(createDateFromDetails(anime.mediaListEntry?.startedAt ?? null), "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"                    
                    selected={createDateFromDetails(anime.mediaListEntry?.startedAt ?? null)}                    
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="text-muted-foreground text-sm">Completed On</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!createDateFromDetails(anime.mediaListEntry?.startedAt ?? null)}
                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {createDateFromDetails(anime.mediaListEntry?.startedAt ?? null) ? format(createDateFromDetails(anime.mediaListEntry?.startedAt ?? null), "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"                    
                    selected={createDateFromDetails(anime.mediaListEntry?.startedAt ?? null)}                    
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>



        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
export default AnimeDetailLibrary;
