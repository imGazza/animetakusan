import useLibrarySortMap from "@/hooks/useLibrarySortMap";
import { createDateFromDetails } from "@/lib/utils";
import type { Anime } from "@/models/common/Anime";
import { displayAnimeStatus } from "@/models/common/AnimeStatus";
import { format } from "date-fns";
import { CalendarPlus2, Info, MonitorCheck, MonitorPlay, Trophy } from "lucide-react";
import { useMemo } from "react";

const LibrarySortInfo = ({ anime, sort }: { anime: Anime; sort: string }) => {

  const { sortMap } = useLibrarySortMap();

  type SortInfoVariant = keyof typeof sortMap;

  const VARIANT_CONFIG: Record<
    SortInfoVariant,
    { Icon: typeof Trophy; label: string, value: string | null}
  > = useMemo(() => ({
    Title: {
      Icon: Info,
      label: "Status",
      value: displayAnimeStatus(anime.status),
    },
    Score: {
      Icon: Trophy,
      label: "Score",
      value: anime.mediaListEntry?.score ? `${anime.mediaListEntry.score}` : null,
    },
    AverageScore: {
      Icon: Trophy,
      label: "Average Score",
      value: anime.averageScore ? `${anime.averageScore}` : null,
    },
    StartedDate: {
      Icon: MonitorPlay,
      label: "Started On",
      value: createDateFromDetails(anime.mediaListEntry?.startedAt ?? null) ? `${format(createDateFromDetails(anime.mediaListEntry?.startedAt ?? null)!, "PP")}` : null,
    },
    CompletedDate: {
      Icon: MonitorCheck,
      label: "Completed On",
      value: createDateFromDetails(anime.mediaListEntry?.completedAt ?? null) ? `${format(createDateFromDetails(anime.mediaListEntry?.completedAt ?? null)!, "PP")}` : null,
    },
    LastAdded: {
      Icon: CalendarPlus2,
      label: "Added On",
      value: anime.mediaListEntry?.createdAt && anime.mediaListEntry?.createdAt !== 0 ? `${format(anime.mediaListEntry.createdAt * 1000, "PP")}` : null,
    },
  }), [anime]);

  const { Icon, label, value } = VARIANT_CONFIG[sort as SortInfoVariant] ?? {};

  if(!value) return null;

  const accentColor = anime.coverImage?.color ?? "#6b7280";

  return (
    <div
      className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-xs w-full overflow-hidden"
      style={{
        backgroundColor: `${accentColor}22`,
        color: accentColor,
      }}
    >
      <Icon className="size-3 shrink-0" style={{ color: accentColor }} />
      <span className="hidden md:block text-[10px] font-medium whitespace-nowrap">{label}</span>
      <span
        className="text-[10px] font-semibold truncate ml-auto"
        style={{ color: accentColor }}
      >
        {value}
      </span>
    </div>
  );
}
export default LibrarySortInfo;