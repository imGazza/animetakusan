namespace AnimeTakusan.MAL.Application.DTOs.Messages;

public class MalSyncActionMessage
{
    public SyncAction Action { get; set; }
    public int MalUserId { get; set; }
    public int AnimeId { get; set; }
    public MalSyncActionStatus? Status { get; set; }
    public int? Score { get; set; }
    public int? Progress { get; set; }
    public MalSyncActionDetailDate CompletedAt { get; set; }
    public MalSyncActionDetailDate StartedAt { get; set; }
}

public class MalSyncActionDetailDate
{
    public int? Year { get; set; }
    public int? Month { get; set; }
    public int? Day { get; set; }
}

public enum SyncAction
{
    Upsert,
    Delete
}
