import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { Check, Pause, Play, Plus, Star, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { animeTitle, type ActivityItem, type ActivityType } from "./lib";
import SectionHeader from "./SectionHeader";

const CONFIG: Record<ActivityType, { Icon: LucideIcon; verb: string; tone: string }> = {
  completed: { Icon: Check, verb: "Finished", tone: "text-violet-500" },
  watching: { Icon: Play, verb: "Watching", tone: "text-cyan-500" },
  planned: { Icon: Plus, verb: "Added", tone: "text-amber-500" },
  rated: { Icon: Star, verb: "Rated", tone: "text-yellow-500" },
  paused: { Icon: Pause, verb: "Paused", tone: "text-muted-foreground" },
  dropped: { Icon: X, verb: "Dropped", tone: "text-rose-500" },
};

const detailText = (item: ActivityItem) => {
  if (item.type === "rated") return ` · ${item.detail}/100`;
  if (item.type === "watching" && item.detail) return ` · ${item.detail} ep watched`;
  return "";
};

const ActivityFeed = ({ items }: { items: ActivityItem[] }) => {
  return (
    <section>
      <SectionHeader title="Recent activity" />
      <Card className="gap-0 rounded-xs py-2">
        {items.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ol className="relative px-4 py-2">
            {/* the spine */}
            <span className="absolute inset-y-4 left-[27px] w-px bg-border" aria-hidden="true" />
            {items.map((item) => {
              const { Icon, verb, tone } = CONFIG[item.type];
              return (
                <li key={item.key} className="relative flex items-start gap-3 py-2">
                  <span
                    className={cn(
                      "z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-border",
                      tone
                    )}
                  >
                    <Icon className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0 flex-1 leading-snug">
                    <p className="truncate text-sm">
                      <span className="text-muted-foreground">{verb} </span>
                      <Link
                        to={`/anime/${item.anime.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {animeTitle(item.anime)}
                      </Link>
                      <span className="text-muted-foreground">{detailText(item)}</span>
                    </p>
                    <span className="text-xs text-muted-foreground/70">
                      {formatDistanceToNowStrict(item.at, { addSuffix: true })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </section>
  );
};

export default ActivityFeed;
