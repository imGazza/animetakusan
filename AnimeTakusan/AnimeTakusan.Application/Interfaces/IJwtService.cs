using AnimeTakusan.Domain.Entitities;

namespace AnimeTakusan.Application.Interfaces;

public interface IJwtHandler
{
    string GetRefreshToken();
    string GenerateUserAccessToken(string refreshToken, User user, IList<string> userRoles);
    string GenerateGuestAccessToken();
    string GenerateRefreshToken();
    void WriteRefreshTokenCookie(string token);
}
