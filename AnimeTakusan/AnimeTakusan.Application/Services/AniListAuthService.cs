using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entities;
using AnimeTakusan.Domain.Exceptions.AuthenticationExceptions;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.Application.Services;

public class AniListAuthService : IAniListAuthService, IInjectable
{
    private readonly IJwtHandler _jwtHandler;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<AniListAuthService> _logger;
    private readonly IAnimeProvider _aniListProvider;


    public AniListAuthService(IJwtHandler jwtHandler, IUserRepository userRepository, ILogger<AniListAuthService> logger, IAnimeProvider aniListProvider)
    {
        _jwtHandler = jwtHandler;
        _userRepository = userRepository;
        _logger = logger;
        _aniListProvider = aniListProvider;
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
            throw new AniListAuthenticationException("Access token is missing.");

        var aniListClaims = _jwtHandler.GetAniListTokenClaims(aniListTokenData.AccessToken);
        var aniListUserIdClaim = aniListClaims.FirstOrDefault(c => c.Type == "sub")?.Value;

        if(string.IsNullOrEmpty(aniListUserIdClaim) || !int.TryParse(aniListUserIdClaim, out var aniListUserId))
            throw new AniListAuthenticationException("Access token does not contain a valid AniList user ID.");
        
        var user = await _userRepository.GetUserByRefreshToken(_jwtHandler.GetRefreshToken());
        if (user == null)
            throw new AniListAuthenticationException("Internal logged user not found.");

        var aniListUser = new AniListUser
        {
            AniListUserId = aniListUserId,
            UserId = user.Id,
            AccessToken = aniListTokenData.AccessToken,
            AccessTokenExpiry = DateTime.UtcNow.AddSeconds(aniListTokenData.ExpiresIn)
        };

        try
        {
            await _userRepository.UpsertAniListUserAsync(aniListUser);
        }
        catch (Exception ex)
        {
            throw new AniListAuthenticationException("Failed to link AniList account to user.", ex);
        }

        _logger.LogInformation($"Successfully linked AniList account (ID: {aniListUserId}) to user (ID: {user.Id}).");
    }

    public async Task<ViewerInfoResponse> GetViewerInfo()
    {
        try
        {
            var viewerInfo = await _aniListProvider.GetViewerInfo();

            await _userRepository.UpdateAniListUserInfoAsync(viewerInfo.Id, viewerInfo.Name, viewerInfo.Avatar);

            return viewerInfo;

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve viewer info from AniList.");
            throw new AniListAuthenticationException("Failed to retrieve viewer info from AniList.", ex);
        }
    }
}
