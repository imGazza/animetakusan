import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import AnimeImage from "@/components/ui/anime-image";
import { format, formatDistanceToNowStrict, isSameDay, isToday, startOfDay } from "date-fns";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { animeTitle, type BacklogEpisode } from "./lib";
import SectionHeader from "./SectionHeader";

const HOME_ACCENT = "var(--accent-home)";

const uniqueDays = (episodes: BacklogEpisode[]): Date[] => {
  const seen = new Map<number, Date>();
  for (const ep of episodes) {
    const day = startOfDay(ep.airedAt);
    seen.set(day.getTime(), day);
  }
  return [...seen.values()];
};

const EpisodeBacklog = ({ episodes }: { episodes: BacklogEpisode[] }) => {
  const days = uniqueDays(episodes);
  const [selected, setSelected] = useState<Date | undefined>(
    episodes.length ? startOfDay(episodes[0].airedAt) : undefined
  );

  const forSelected = selected ? episodes.filter((e) => isSameDay(e.airedAt, selected)) : [];

  return (
    <section>
      <SectionHeader title="Episode backlog" count={episodes.length} />
      <Card className="grid gap-0 overflow-hidden rounded-xs py-0 md:grid-cols-[auto_1fr]">
        {/* Calendar — days with unwatched aired episodes are dotted in the home accent. */}
        <div className="flex justify-center border-b border-border p-2 md:border-b-0 md:border-r">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            defaultMonth={selected}
            showOutsideDays={false}
            modifiers={{ hasEpisodes: days }}
            modifiersClassNames={{
              hasEpisodes:
                "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-accent-home",
            }}
          />
        </div>

        {/* Agenda for the selected day */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">
              {selected ? (isToday(selected) ? "Today" : format(selected, "EEEE, d MMM")) : "No episodes"}
            </span>
            {forSelected.length > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                {forSelected.length} to watch
              </span>
            )}
          </div>

          {episodes.length === 0 ? (
            <CaughtUp />
          ) : forSelected.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing aired on this day. Pick a dotted date to see what's waiting.
            </p>
          ) : (
            <ul className="max-h-[19rem] divide-y divide-border overflow-y-auto">
              {forSelected.map((ep) => (
                <BacklogRow key={ep.key} episode={ep} />
              ))}
            </ul>
          )}
        </div>
      </Card>
    </section>
  );
};

const BacklogRow = ({ episode }: { episode: BacklogEpisode }) => {
  const { anime, episode: epNumber, airedAt } = episode;
  return (
    <li>
      <Link
        to={`/anime/${anime.id}`}
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
      >
        <div className="aspect-[37/53] w-9 shrink-0 overflow-hidden rounded-sm bg-muted">
          <AnimeImage url={anime.coverImage.extraLarge} title={animeTitle(anime)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{animeTitle(anime)}</p>
          <p className="text-xs text-muted-foreground">
            <span style={{ color: HOME_ACCENT }} className="font-semibold">
              Ep {epNumber}
            </span>
            {" · aired "}
            {formatDistanceToNowStrict(airedAt, { addSuffix: true })}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
      </Link>
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
