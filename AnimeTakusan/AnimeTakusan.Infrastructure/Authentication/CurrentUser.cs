using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;
using Microsoft.AspNetCore.Http;

namespace AnimeTakusan.Infrastructure.Authentication;

public class CurrentUser : ICurrentUser, IInjectable
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? AniListUserId =>
        int.TryParse(
            _httpContextAccessor.HttpContext?.User.FindFirst(AniListClaimTypes.AniListUserId)?.Value,
            out var id)
            ? id
            : null;

    public int? UserId =>
        int.TryParse(
            _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value,
            out var id)
            ? id
            : null;
}
