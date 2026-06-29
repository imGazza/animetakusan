using AnimeTakusan.MAL.Application.DTOs;
using AnimeTakusan.MAL.Application.DTOs.Messages;

namespace AnimeTakusan.MAL.Application.Mapping;

public static class MalSyncMapper
{
    public static MalStatus ToMalStatus(MalSyncActionStatus status)
    {
        return status switch
        {
            MalSyncActionStatus.CURRENT => MalStatus.Watching,
            MalSyncActionStatus.COMPLETED => MalStatus.Completed,
            MalSyncActionStatus.DROPPED => MalStatus.Dropped,
            MalSyncActionStatus.PLANNING => MalStatus.PlanToWatch,
            MalSyncActionStatus.PAUSED => MalStatus.OnHold,
            MalSyncActionStatus.REPEATING => MalStatus.Watching,
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
        };
    }

    public static int ToMalScore(int score)
    {
        return (int)Math.Round(score / 10.0);
    }

    public static string ToMalDate(MalSyncActionDetailDate date)
    {
        if (date == null || date.Year == null || date.Month == null || date.Day == null)
        {
            return null;
        }

        return $"{date.Year:D4}-{date.Month:D2}-{date.Day:D2}";
    }
}
