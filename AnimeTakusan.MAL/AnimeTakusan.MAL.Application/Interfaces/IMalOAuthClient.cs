using AnimeTakusan.MAL.Application.DTOs;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMalOAuthClient
{
    Task<MalTokensResponse> ExchangeCodeAsync(string code, string codeVerifier);
    Task<MalTokensResponse> RefreshTokenAsync(string refreshToken);
}
