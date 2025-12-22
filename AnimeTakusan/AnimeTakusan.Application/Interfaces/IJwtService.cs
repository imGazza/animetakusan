using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Interfaces;

public interface IJwtHandler
{
    string GetRefreshToken();
    (string Token, DateTime ExpiresAt) GenerateUserAccessToken(string refreshToken, User user, IList<string> userRoles);
    (string Token, DateTime ExpiresAt) GenerateGuestAccessToken();
    string GenerateRefreshToken();
    void WriteRefreshTokenCookie(string token);
    void DeleteRefreshTokenCookie();
}
