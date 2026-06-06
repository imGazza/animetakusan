import { useEffect, useState } from "react";
import { Button } from "./button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { createDateFromDetails } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog";
import AnimeDetailEntryDate from "./anime-detail-entry-date";
import AnimeDetailEntryScore from "./anime-detail-entry-score";
import AnimeDetailEntryStatus from "./anime-detail-entry-status";
import useMediaQuery, { DESKTOP_BREAKPOINT } from "@/hooks/useMediaQuery";
import AnimeDetailEntryTrigger from "./anime-detail-entry-trigger";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import AnimeDetailEntryEpisodes from "./anime-detail-entry-episodes";
import type { AnimeDetail } from "@/models/common/AnimeDetail";
import { AnimeEntryStatusKeySchema } from "@/models/common/AnimeEntryStatus";
import type { AnimeEntryUpsert } from "@/models/common/AnimeEntryUpsert";
import { useAnimeEntryMutation } from "@/features/queries";

// The entry state is intentionally initialised as a blank object (all nulls) rather
// than a clone of anime.mediaListEntry. This allows me to send to the server only the
// fields the user explicitly changed and leaving everything else
// null so the server ignores those fields.
//
// The motivation is a specific AniList side-effect: when status=COMPLETED is sent, the
// server automatically overwrites progress with the maximum episode count. By keeping
// status null when the user only adjusts progress (and vice-versa), triggering
// that behaviour unintentionally is avoided. displayEntry merges state over anime.mediaListEntry
// for rendering the values of fields.
const defaultEntry = (anime: AnimeDetail): AnimeEntryUpsert => ({
  mediaId: anime.id,
  status: null,
  score: null,
  progress: null,
  startedAt: null,
  completedAt: null
});

//TODO: Find a solution for the Toast that moves when scrollbar disappears or appears at dialog open/close

const AnimeDetailLibraryEntry = ({ anime }: { anime: AnimeDetail }) => {

  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const { mutate } = useAnimeEntryMutation();
  const [open, setOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const [mediaListEntry, setMediaListEntry] = useState<AnimeEntryUpsert>(
    defaultEntry(anime)
  );

  useEffect(() => {
    if (open) setMediaListEntry(defaultEntry(anime));
  }, [open]);

  const displayEntry = {
    status: mediaListEntry.status ?? anime.mediaListEntry?.status ?? null,
    progress: mediaListEntry.progress ?? anime.mediaListEntry?.progress ?? 0,
    startedAt: mediaListEntry.startedAt ?? anime.mediaListEntry?.startedAt ?? null,
    completedAt: mediaListEntry.completedAt ?? anime.mediaListEntry?.completedAt ?? null,
    score: mediaListEntry.score ?? anime.mediaListEntry?.score ?? 0,
  };

  // ------ Handlers for updating values --------

  const handleChangeStatus = (status: string) => {
    setMediaListEntry(prev => ({ ...prev, status }));
  }

  const handleChangeEpisodes = (progress: number) => {
    if (anime.episodes !== null && progress > anime.episodes) {
      progress = anime.episodes;
    }
    if (progress < 0) {
      progress = 0;
    }
    setMediaListEntry(prev => progress !== prev.progress ? { ...prev, progress } : prev);
  }

  const handleChangeStartDate = (date: Date | undefined) => {
    setMediaListEntry(prev => ({ ...prev, startedAt: date ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : { year: null, month: null, day: null } })); // Convert Date to DetailedDate
  }

  const handleChangeCompletedDate = (date: Date | undefined) => {
    setMediaListEntry(prev => ({ ...prev, completedAt: date ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : { year: null, month: null, day: null } }));
  }

  const handleChangeScore = (score: number) => {
    setMediaListEntry(prev => ({ ...prev, score }));
  }

  // ------ Save helper methods --------

  const shouldPromptCompletion = () =>
    displayEntry.status !== AnimeEntryStatusKeySchema.enum.COMPLETED &&
    anime.episodes !== null &&
    anime.episodes === displayEntry.progress;

  const handleSave = () => {
    if (shouldPromptCompletion()) {
      setSaveConfirmOpen(true);
      return;
    }
    commitSave(mediaListEntry);
  };

  const commitSave = (entry: AnimeEntryUpsert) => {
    setOpen(false);
    setSaveConfirmOpen(false);

    const isDateSet = (d: typeof entry.startedAt) =>
      d !== null && (d.year !== null || d.month !== null || d.day !== null);
    const hasChanges = entry.status !== null || entry.score !== null || entry.progress !== null ||
      isDateSet(entry.startedAt) || isDateSet(entry.completedAt);
    if (!hasChanges) return;

    mutate(entry);
  };

  // ---------- DOM ----------

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="no-scrollbar overflow-y-auto overflow-x-hidden flex flex-col gap-5">

            {/* ENTRY STATUS */}

            <AnimeDetailEntryStatus status={displayEntry.status} setStatus={handleChangeStatus} />

            {/* EPISODES */}

            <AnimeDetailEntryEpisodes progress={displayEntry.progress} setProgress={handleChangeEpisodes} episodes={anime.episodes ?? null} />

            {/* DATES */}

            <div className="flex gap-4">
              <AnimeDetailEntryDate title="Started On" date={createDateFromDetails(displayEntry.startedAt) ?? undefined} setDate={handleChangeStartDate} />
              <AnimeDetailEntryDate title="Completed On" date={createDateFromDetails(displayEntry.completedAt) ?? undefined} setDate={handleChangeCompletedDate} />
            </div>

            {/* SCORE */}

            <AnimeDetailEntryScore score={displayEntry.score} setScore={handleChangeScore} />
          </div>
          <DialogFooter>
            <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
              <AlertDialogContent className="rounded-xs">
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have watched all episodes. Do you want to mark this anime as Completed today?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xs">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="rounded-xs" onClick={() => commitSave(mediaListEntry)}>
                    Save as-is
                  </AlertDialogAction>
                  <AlertDialogAction className="rounded-xs" onClick={() => commitSave({ ...mediaListEntry, status: AnimeEntryStatusKeySchema.enum.COMPLETED, completedAt: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() } })}>
                    Save as Completed
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                      Are you sure you want to delete this entry from your library?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel size="sm" className="rounded-xs">Cancel</AlertDialogCancel>
                    <AlertDialogAction size="sm" className="rounded-xs">Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }

            <Button type="submit" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
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

          <AnimeDetailEntryStatus status={displayEntry.status} setStatus={handleChangeStatus} />

          {/* EPISODES */}

          <AnimeDetailEntryEpisodes progress={displayEntry.progress} setProgress={handleChangeEpisodes} episodes={anime.episodes ?? null} />

          {/* DATES */}

          <div className="flex gap-4">
            <AnimeDetailEntryDate title="Started On" date={createDateFromDetails(displayEntry.startedAt) ?? undefined} setDate={handleChangeStartDate} />
            <AnimeDetailEntryDate title="Completed On" date={createDateFromDetails(displayEntry.completedAt) ?? undefined} setDate={handleChangeCompletedDate} />
          </div>

          {/* SCORE */}

          <AnimeDetailEntryScore score={displayEntry.score} setScore={handleChangeScore} />
        </div>

        <DrawerFooter>
          <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
            <AlertDialogContent className="rounded-xs">
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have watched all episodes. Do you want to mark this anime as Completed today?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xs">Cancel</AlertDialogCancel>
                <AlertDialogAction className="rounded-xs" onClick={() => commitSave(mediaListEntry)}>
                  Save as-is
                </AlertDialogAction>
                <AlertDialogAction className="rounded-xs" onClick={() => commitSave({ ...mediaListEntry, status: AnimeEntryStatusKeySchema.enum.COMPLETED, completedAt: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() } })}>
                  Save as Completed
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
export default AnimeDetailLibraryEntry;
