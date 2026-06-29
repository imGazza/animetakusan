using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.DTOs.Messages;

public class MalSyncActionMessage
{
    public SyncAction Action { get; set; }
    public int MalUserId { get; set; }
    public int AnimeId { get; set; }
    public AnimeMediaListStatus? Status { get; set; }
    public int? Score { get; set; }
    public int? Progress { get; set; }
    public DetailedDate CompletedAt { get; set; }
    public DetailedDate StartedAt { get; set; }
}

public enum SyncAction
{
    Upsert,
    Delete
}
