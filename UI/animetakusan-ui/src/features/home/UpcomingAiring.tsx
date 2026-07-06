import AnimeImage from "@/components/ui/anime-image";
import { Card } from "@/components/ui/card";
import type { AnimeEntry } from "@/models/library/UserLibrary";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router";
import { animeTitle } from "./lib";
import SectionHeader from "./SectionHeader";

const HOME_ACCENT = "var(--accent-home)";

interface Upcoming {
  anime: AnimeEntry["anime"];
  episode: number;
  airsAt: Date;
}

const getUpcoming = (watching: AnimeEntry[], now: Date, limit = 5): Upcoming[] =>
  watching
    .flatMap(({ anime }) =>
      anime.nextAiringEpisode
        ? [{ anime, episode: anime.nextAiringEpisode.episode, airsAt: new Date(anime.nextAiringEpisode.airingAt * 1000) }]
        : []
    )
    .filter((u) => u.airsAt.getTime() >= now.getTime())
    .sort((a, b) => a.airsAt.getTime() - b.airsAt.getTime())
    .slice(0, limit);

const UpcomingAiring = ({ watching, now }: { watching: AnimeEntry[]; now: Date }) => {
  const upcoming = getUpcoming(watching, now);

  return (
    <section>
      <SectionHeader title="Up next" count={upcoming.length} />
      <Card className="gap-0 rounded-xs py-2">
        {upcoming.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">No upcoming episodes.</p>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((u) => (
              <li key={u.anime.id}>
                <Link
                  to={`/anime/${u.anime.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <div className="aspect-[37/53] w-8 shrink-0 overflow-hidden rounded-sm bg-muted">
                    <AnimeImage url={u.anime.coverImage.extraLarge} title={animeTitle(u.anime)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{animeTitle(u.anime)}</p>
                    <p className="text-xs text-muted-foreground">Episode {u.episode}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold tabular-nums" style={{ color: HOME_ACCENT }}>
                    {formatDistanceToNowStrict(u.airsAt, { addSuffix: true })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
};
export default UpcomingAiring;