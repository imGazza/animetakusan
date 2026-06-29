namespace AnimeTakusan.MAL.Domain;

public class MalReplayMessage
{
    public int Id { get; set; }
    public int MalUserId { get; set; }
    public string RawMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
