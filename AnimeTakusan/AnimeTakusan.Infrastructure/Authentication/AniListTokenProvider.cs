using AnimeTakusan.Application.Caching;
using AnimeTakusan.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace AnimeTakusan.Infrastructure.Authentication;

public class AniListTokenProvider : IAniListTokenProvider, IInjectable
{
    private readonly IUserRepository _userRepository;
    private readonly ICacheService _cacheService;
    private readonly IConfiguration _configuration;

    public AniListTokenProvider(IUserRepository userRepository, ICacheService cacheService, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _cacheService = cacheService;
        _configuration = configuration;
    }

    public async Task<string?> GetAniListTokenAsync(Guid userId)
    {
        var aniListToken = await _cacheService.GetAsync<string>(CacheKeys.AniListToken(userId));

        if (!string.IsNullOrEmpty(aniListToken))
            return aniListToken;

        var aniListUser = await _userRepository.GetAniListUserByIdAsync(userId);

        if(aniListUser is null || string.IsNullOrEmpty(aniListUser.AccessToken) || aniListUser.AccessTokenExpiry is null || aniListUser.AccessTokenExpiry <= DateTime.UtcNow)
        {
            await _cacheService.RemoveAsync(CacheKeys.AniListToken(userId));
            return null;
        }

        // Calculate the min value between the configuration and the actual token expiration day,
        // to avoid caching the token longer than it is valid for.
        var tokenTtlConfig = int.TryParse(_configuration["CacheSettings:AniListTokenTtlDays"], out var ttl) ? ttl : 1;
        var tokenTtl = TimeSpan.FromDays(Math.Min(tokenTtlConfig, (aniListUser.AccessTokenExpiry.Value - DateTime.UtcNow).TotalDays));
        await _cacheService.SetAsync(CacheKeys.AniListToken(userId), aniListUser.AccessToken, tokenTtl);
        return aniListUser.AccessToken;
    }
}
