import { Card } from "@/components/ui/card";
import AnimeImage from "@/components/ui/anime-image";
import { Button } from "@/components/ui/button";
import { useAnimeEntryMutation } from "@/features/queries";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { Check, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { animeTitle, watchedUpToUpsert, type BacklogEpisode } from "./lib";
import SectionHeader from "./SectionHeader";

const HOME_ACCENT = "var(--accent-home)";

/**
 * Every aired-but-unwatched episode, newest first. Air dates of past episodes are
 * estimates (back-calculated from the next airing / spread over start–end), so they're
 * shown as relative "aired X ago" rather than on a calendar that would imply precision.
 * What's coming next lives in UpcomingAiring.
 */
const EpisodeBacklog = ({ episodes }: { episodes: BacklogEpisode[] }) => {
  return (
    <section>
      <SectionHeader title="Episode backlog" count={episodes.length} />
      <Card className="gap-0 overflow-hidden rounded-xs py-0">
        {episodes.length === 0 ? (
          <CaughtUp />
        ) : (
          <ul className="max-h-[22rem] divide-y divide-border overflow-y-auto">
            {episodes.map((ep) => (
              <BacklogRow key={ep.key} episode={ep} />
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
};

const BacklogRow = ({ episode }: { episode: BacklogEpisode }) => {
  const { anime, episode: epNumber, airedAt } = episode;
  // One mutation per row, so each row tracks its own pending state. The shared mutation
  // awaits the library refetch in onSettled, so isPending stays true until the row is
  // actually gone from the refreshed data — no flash of the stale row in between.
  const { mutate, isPending } = useAnimeEntryMutation();

  const isFinale = anime.episodes != null && epNumber >= anime.episodes;
  const label = isFinale ? `Mark Ep ${epNumber} watched and complete` : `Mark watched up to Ep ${epNumber}`;

  const markWatched = () => {
    const payload = watchedUpToUpsert(anime, epNumber, new Date());
    if (payload) mutate(payload);
  };

  return (
    <li className={cn("flex items-center transition-opacity", isPending && "pointer-events-none opacity-50")}>
      <Link
        to={`/anime/${anime.id}`}
        className="group flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-2 transition-colors hover:bg-muted/60"
      >
        <div className="aspect-[37/53] w-9 shrink-0 overflow-hidden rounded-sm bg-muted">
          <AnimeImage url={anime.coverImage.extraLarge} title={animeTitle(anime)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{animeTitle(anime)}</p>
          <p className="text-xs text-muted-foreground">
            <span style={{ color: HOME_ACCENT }} className="font-semibold">
              Episode {epNumber}
            </span>
            {isFinale && " (final)"}
            {" · aired "}
            {formatDistanceToNowStrict(airedAt, { addSuffix: true })}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <div className="shrink-0 pl-1 pr-4">
        <Button
          size="icon-xs"
          variant="outline"
          onClick={markWatched}
          disabled={isPending}
          className="rounded-xs text-muted-foreground hover:text-foreground"
          aria-label={label}
          title={label}
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
        </Button>
      </div>
    </li>
  );
};

const CaughtUp = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-12 text-center">
    <CheckCircle2 className="size-8" style={{ color: HOME_ACCENT }} strokeWidth={1.75} />
    <p className="text-sm font-medium">You're all caught up</p>
    <p className="max-w-[16rem] text-xs text-muted-foreground">
      No aired episodes are waiting for the shows you're watching.
    </p>
  </div>
);

export default EpisodeBacklog;
