import Container from "@/components/ui/container";
import PageHeaderBlock from "@/components/ui/page-header-block";
import type { AnimeEntry, UserLibrary } from "@/models/library/UserLibrary";
import { useMemo } from "react";
import ActivityFeed from "./ActivityFeed";
import ContinueWatching from "./ContinueWatching";
import EpisodeBacklog from "./EpisodeBacklog";
import UpcomingAiring from "./UpcomingAiring";
import { buildActivity, getBacklogEpisodes, getListEntries, WATCHING_LIST } from "./lib";

interface HomeViewProps {
  library: UserLibrary | undefined;
  /** Injectable for deterministic rendering (tests/preview); defaults to now. */
  now?: Date;
}

const HomeView = ({ library, now }: HomeViewProps) => {
  const reference = now ?? new Date();

  const { watching, backlog, activity } = useMemo(() => {
    const watching: AnimeEntry[] = getListEntries(library, WATCHING_LIST);
    return {
      watching,
      backlog: getBacklogEpisodes(watching, reference),
      activity: buildActivity(library),
    };
    // reference is a fresh Date each render; key off its day so we don't recompute needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, reference.toDateString()]);

  return (
    <Container className="flex flex-col gap-8 animate-in fade-in duration-300">
      <PageHeaderBlock variant="home" title="Home" />
      <ContinueWatching entries={watching} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <EpisodeBacklog episodes={backlog} />
          <UpcomingAiring watching={watching} now={reference} />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed items={activity} />
        </div>
      </div>
    </Container>
  );
};

export default HomeView;
