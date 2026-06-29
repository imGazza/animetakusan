namespace AnimeTakusan.MAL.Application.DTOs.Messages;

public enum Status
{
    Linked,
    Expired,
    Refreshed
}

public record MalAuthEventMessage(Guid UserId, int MalUserId, DateTime RefreshTokenExpiresAt, Status Status);