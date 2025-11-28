using AnimeTakusan.Domain.Entitities;

namespace AnimeTakusan.Application.Interfaces;

public interface IJwtHandler
{
    string GetRefreshToken();
    string GenerateAuthenticatedAccessToken(string refreshToken);
    string GenerateGuestAccessToken();
    string GenerateRefreshToken();
    void WriteRefreshTokenCookie(string token);
}
