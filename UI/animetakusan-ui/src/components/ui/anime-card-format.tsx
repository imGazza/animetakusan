import { calculateDurationFromMinutes } from "@/lib/utils";
import { type AnimeFormatKey, displayFormat } from "@/models/common/AnimeFormat";
import { useMemo } from "react";

const formatDuration = (hours: number, minutes: number): string => {
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

const AnimeCardFormat = ({ format, episodes, duration }: { format: AnimeFormatKey; episodes?: number, duration?: number }) => {

  if (!format) {
    return null;
  }

  const formattedDuration = useMemo(() => {
      // Next airing episode
      if (duration) {
        const { hours, minutes } = calculateDurationFromMinutes(duration);
        const timeRemaining = formatDuration(hours, minutes);
        return timeRemaining;
      }
      return "";
    }, [duration]);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-md xl:text-xs text-muted-foreground font-semibold tracking-wider">
        {displayFormat(format)}
      </div>
      <div className="text-md xl:text-xs text-muted-foreground tracking-wider">
        {episodes && episodes > 1 ? `${episodes} episodes` : formattedDuration && formattedDuration}
      </div>
    </div>
  );
}
export default AnimeCardFormat;