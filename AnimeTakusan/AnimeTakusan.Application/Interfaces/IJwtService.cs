using AnimeTakusan.Domain.Entitities;

namespace AnimeTakusan.Application.Interfaces;

public interface IJwtHandler
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    void WriteRefreshTokenCookie(string token);
}
