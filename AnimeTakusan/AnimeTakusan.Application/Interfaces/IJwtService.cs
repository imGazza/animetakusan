using System.Security.Claims;
using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Interfaces;

public interface IJwtHandler
{
    string GetRefreshToken();
    (string Token, DateTime ExpiresAt) GenerateUserAccessToken(User user, List<Claim> additionalClaims);
    (string Token, DateTime ExpiresAt) GenerateGuestAccessToken();
    string GenerateRefreshToken();
    void WriteRefreshTokenCookie(string token);
    void DeleteRefreshTokenCookie();
    List<Claim> GetAniListTokenClaims(string token);
}
