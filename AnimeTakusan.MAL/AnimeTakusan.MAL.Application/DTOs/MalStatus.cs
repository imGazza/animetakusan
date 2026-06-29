namespace AnimeTakusan.MAL.Application.DTOs;

public enum MalStatus
{
    Watching, 
    Completed,
    Dropped,
    PlanToWatch,
    OnHold
}

public static class MalStatusExtensions
{
    public static string ToMalString(this MalStatus status)
    {
        return status switch
        {
            MalStatus.Watching => "watching",
            MalStatus.Completed => "completed",
            MalStatus.Dropped => "dropped",
            MalStatus.PlanToWatch => "plan_to_watch",
            MalStatus.OnHold => "on_hold",
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
        };
    }
}
