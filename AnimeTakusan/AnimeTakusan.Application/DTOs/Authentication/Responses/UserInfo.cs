using AnimeTakusan.Domain.Common;

namespace AnimeTakusan.Application.DTOs.Authentication.Responses;

public record UserInfo
{
    public Guid Id { get; init; }
    public string UserName { get; init; }
    public string ProfilePicture { get; init; }
    public List<SyncedAccounts> LinkedAccounts { get; init; }
}
