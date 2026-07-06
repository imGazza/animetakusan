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
        <div className="no-scrollbar -mx-2.5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2.5 pb-2 md:mx-0 md:px-0">
          {entries.map((entry) => (
            <div key={entry.anime.id} className="w-[140px] shrink-0 snap-start md:w-[170px]">
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
