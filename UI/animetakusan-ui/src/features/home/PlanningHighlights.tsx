import AnimeImage from "@/components/ui/anime-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAnimeEntryMutation } from "@/features/queries";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Loader2, Play } from "lucide-react";
import { Link } from "react-router";
import { animeTitle, watchedUpToUpsert, type PlanningHighlight } from "./lib";
import SectionHeader from "./SectionHeader";

/** Planning shows that are airing now or premiering soon. Renders nothing when there are none. */
const PlanningHighlights = ({ items }: { items: PlanningHighlight[] }) => {
  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeader title="From your planning" count={items.length} />
      {/* Same card/row metrics as EpisodeBacklog, so the two side-by-side lists line up row for row. */}
      <Card className="gap-0 overflow-hidden rounded-xs py-0">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <PlanningRow key={item.anime.id} item={item} />
          ))}
        </ul>
      </Card>
    </section>
  );
};

const PlanningRow = ({ item }: { item: PlanningHighlight }) => {
  const { anime, kind, date, airedEpisodes } = item;
  // Per-row mutation: isPending lasts until the library refetch lands (see EpisodeBacklog).
  const { mutate, isPending } = useAnimeEntryMutation();

  // "Started watching" = first episode seen: progress 1, Planning → Current, startedAt today.
  const start = () => {
    const payload = watchedUpToUpsert(anime, 1, new Date());
    if (payload) mutate(payload);
  };

  return (
    <li className={cn("flex items-center transition-opacity", isPending && "pointer-events-none opacity-50")}>
      <Link
        to={`/anime/${anime.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 pr-2 transition-colors hover:bg-muted/60"
      >
        <div className="aspect-[37/53] w-9 shrink-0 overflow-hidden rounded-sm bg-muted">
          <AnimeImage url={anime.coverImage.extraLarge} title={animeTitle(anime)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{animeTitle(anime)}</p>
          <p className="truncate text-xs text-muted-foreground">
            {kind === "airing"
              ? `Now airing · ${airedEpisodes} ep${airedEpisodes === 1 ? "" : "s"} out`
              : `Premieres ${format(date!, "EEE d MMM")}`}
          </p>
        </div>
      </Link>
      <div className="shrink-0 pl-1 pr-4">
        {kind === "airing" ? (
          <Button
            size="xs"
            variant="outline"
            onClick={start}
            disabled={isPending}
            className="gap-1 rounded-xs text-xs text-muted-foreground hover:text-foreground"
            aria-label={`Started watching ${animeTitle(anime)}: mark episode 1 watched`}
            title="Mark episode 1 watched and move to Watching"
          >
            {isPending ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
            Started watching
          </Button>
        ) : (
          <span className="text-xs font-semibold tabular-nums text-muted-foreground">
            {formatDistanceToNowStrict(date!, { addSuffix: true })}
          </span>
        )}
      </div>
    </li>
  );
};

export default PlanningHighlights;
