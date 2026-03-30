using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Services;

public class AniListAuthService : IAniListAuthService, IInjectable
{
    private readonly IJwtHandler _jwtHandler;
    private readonly IUserRepository _userRepository;


    public AniListAuthService(IJwtHandler jwtHandler, IUserRepository userRepository)
    {
        _jwtHandler = jwtHandler;
        _userRepository = userRepository;
    }

    public void VerifyCallbackState(string code)
    {
        if (string.IsNullOrEmpty(code))
            throw new ArgumentException("Authorization code is missing.");

        var refreshToken = _jwtHandler.GetRefreshToken();
        if (string.IsNullOrEmpty(refreshToken))
            throw new InvalidOperationException("Cannot verify logged user.");
    }

    public async Task LinkAniListAccountToUser(AniListTokenResponse aniListTokenData)
    {
        if (string.IsNullOrEmpty(aniListTokenData?.AccessToken))
            throw new ArgumentException("AniList access token is missing.");

        var aniListClaims = _jwtHandler.GetAniListTokenClaims(aniListTokenData.AccessToken);
        var aniListUserIdClaim = aniListClaims.FirstOrDefault(c => c.Type == "sub")?.Value;

        if(string.IsNullOrEmpty(aniListUserIdClaim) || !int.TryParse(aniListUserIdClaim, out var aniListUserId))
            throw new ArgumentException("AniList access token does not contain a valid AniList user ID.");
        
        var user = await _userRepository.GetUserByRefreshToken(_jwtHandler.GetRefreshToken());
        if (user == null)
            throw new InvalidOperationException("Logged user not found.");

        var aniListUser = new AniListUser
        {
            AniListUserId = aniListUserId,
            UserId = user.Id,
            AccessToken = aniListTokenData.AccessToken,
            AccessTokenExpiry = DateTime.UtcNow.AddSeconds(aniListTokenData.ExpiresIn)
        };

        await _userRepository.AddAniListUserAsync(aniListUser);
    }
}
