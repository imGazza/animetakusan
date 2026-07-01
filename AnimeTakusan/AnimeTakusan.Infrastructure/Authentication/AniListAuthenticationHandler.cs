using System.Net.Http.Headers;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;
using Microsoft.AspNetCore.Http;

namespace AnimeTakusan.Infrastructure.Authentication;

public class AniListAuthenticationHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ITokenProtector _tokenProtector;

    public AniListAuthenticationHandler(IHttpContextAccessor httpContextAccessor, ITokenProtector tokenProtector)
    {
        _httpContextAccessor = httpContextAccessor;
        _tokenProtector = tokenProtector;
    }

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var context = _httpContextAccessor.HttpContext;

        if (context is not null)
        {
            var aniListAccessToken = context.User.FindFirst(AniListClaimTypes.AccessToken)?.Value;

            if (!string.IsNullOrEmpty(aniListAccessToken))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _tokenProtector.Unprotect(aniListAccessToken));
        }

        return base.SendAsync(request, cancellationToken);
    }
}
