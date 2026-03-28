using System.Net.Http.Headers;
using AnimeTakusan.Application.Utility;
using Microsoft.AspNetCore.Http;

namespace AnimeTakusan.Infrastructure.Authentication;

public class AniListAuthenticationHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AniListAuthenticationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
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
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", aniListAccessToken);
        }

        return base.SendAsync(request, cancellationToken);
    }
}
