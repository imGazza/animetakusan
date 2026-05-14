import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "./button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { createDateFromDetails } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import AnimeDetailEntryDate from "./anime-detail-entry-date";
import AnimeDetailEntryScore from "./anime-detail-entry-score";
import AnimeDetailEntryStatus from "./anime-detail-entry-status";
import useMediaQuery, { DESKTOP_BREAKPOINT } from "@/hooks/useMediaQuery";
import AnimeDetailEntryTrigger from "./anime-detail-entry-trigger";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import AnimeDetailEntryEpisodes from "./anime-detail-entry-episodes";
import type { AnimeDetail } from "@/models/common/AnimeDetail";

// TODO: clone the mediaListEntry data into local state and only update on submit

const AnimeDetailLibraryEntry = ({ anime }: { anime: AnimeDetail }) => {

  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    anime?.mediaListEntry?.status ?? null
  );
  const [startedDate, setStartedDate] = useState<Date | undefined>(
    createDateFromDetails(anime.mediaListEntry?.startedAt ?? null) ?? undefined
  );
  const [completedDate, setCompletedDate] = useState<Date | undefined>(
    createDateFromDetails(anime.mediaListEntry?.completedAt ?? null) ?? undefined
  );
  const [score, setScore] = useState<number>(anime.mediaListEntry?.score ?? 0);

  if (!anime) {
    return <div>Anime not found</div>
  }

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="rounded-xs w-60 gap-2 px-3"
          >
            <AnimeDetailEntryTrigger anime={anime} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{anime.title.english || anime.title.romaji || ""}</DialogTitle>
            <DialogDescription className="text-sm">Edit library entry</DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar overflow-y-auto flex flex-col gap-5">
            <AnimeDetailEntryStatus status={selectedStatus} setStatus={setSelectedStatus} />
            <AnimeDetailEntryEpisodes anime={anime} />
            <div className="flex gap-4">
              <AnimeDetailEntryDate date={startedDate} setDate={setStartedDate} />
              <AnimeDetailEntryDate date={completedDate} setDate={setCompletedDate} />
            </div>
            <AnimeDetailEntryScore score={score} setScore={setScore} />
          </div>
          <DialogFooter>
            {
              anime.mediaListEntry &&
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xs">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure to delete this entry from your library?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel size="sm" className="rounded-xs">Cancel</AlertDialogCancel>
                    <AlertDialogAction size="sm" className="rounded-xs">Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>}
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          className="rounded-xs w-full gap-2 px-3"
        >
          <AnimeDetailEntryTrigger anime={anime} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{anime.title.english || anime.title.romaji || ""}</DrawerTitle>
          <DrawerDescription>Edit library entry</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 flex flex-col gap-5">

          {/* ENTRY STATUS */}

          <AnimeDetailEntryStatus status={selectedStatus} setStatus={setSelectedStatus} />

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
            <AnimeDetailEntryDate date={startedDate} setDate={setStartedDate} />
            <AnimeDetailEntryDate date={completedDate} setDate={setCompletedDate} />
          </div>

          {/* SCORE */}

          <AnimeDetailEntryScore score={score} setScore={setScore} />
        </div>

        <DrawerFooter>
          {
            anime.mediaListEntry &&
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xs">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure to delete this entry from your library?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel size="sm" className="rounded-xs">Cancel</AlertDialogCancel>
                  <AlertDialogAction size="sm" className="rounded-xs">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>}
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
export default AnimeDetailLibraryEntry;
