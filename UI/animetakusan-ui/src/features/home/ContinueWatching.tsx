import AnimeCard from "@/components/ui/anime-card";
import AnimeCardProgress from "@/components/ui/anime-card-progress";
import type { AnimeEntry } from "@/models/library/UserLibrary";
import { Compass } from "lucide-react";
import { Link } from "react-router";
import SectionHeader from "./SectionHeader";

const ContinueWatching = ({ entries }: { entries: AnimeEntry[] }) => {
  return (
    <section>
      <SectionHeader
        title="Continue watching"
        count={entries.length}
        action={{ label: "Library", href: "/library" }}
      />

      {entries.length === 0 ? (
        <EmptyRail />
      ) : (
        // Mobile: 3-column grid, same as Library/Browse (AnimeDisplay) — a swipe rail there
        // fought with the page scroll and snapped the first card flush to the screen edge.
        // md+: horizontal rail.
        <div className="grid grid-cols-3 gap-3 md:no-scrollbar md:flex md:snap-x md:snap-mandatory md:gap-4 md:overflow-x-auto md:pb-2">
          {entries.map((entry) => (
            <div key={entry.anime.id} className="flex min-w-0 flex-col md:w-[170px] md:shrink-0 md:snap-start">
              <AnimeCard anime={entry.anime} />
              <AnimeCardProgress anime={entry.anime} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const EmptyRail = () => (
  <div className="flex flex-col items-center gap-3 rounded-xs border border-dashed border-border/70 px-6 py-10 text-center">
    <p className="text-sm text-muted-foreground">Nothing in progress right now.</p>
    <Link
      to="/browse"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
    >
      <Compass className="size-4" style={{ color: "var(--accent-browse)" }} />
      Find something to watch
    </Link>
  </div>
);

export default ContinueWatching;
