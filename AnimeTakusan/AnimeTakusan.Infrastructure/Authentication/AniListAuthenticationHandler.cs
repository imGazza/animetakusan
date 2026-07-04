using System.Net.Http.Headers;
using System.Security.Claims;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace AnimeTakusan.Infrastructure.Authentication;

public class AniListAuthenticationHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AniListAuthenticationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var context = _httpContextAccessor.HttpContext;

        if (context is not null)
        {            
            var authScope = context.RequestServices.GetRequiredService<AniListAuthScope>();

            if (authScope.AttachToken)
            {
                var tokenProvider = context.RequestServices.GetRequiredService<IAniListTokenProvider>();
                var tokenProtector = context.RequestServices.GetRequiredService<ITokenProtector>();

                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var aniListAccessToken = await tokenProvider.GetAniListTokenAsync(Guid.Parse(userId!));

                if (!string.IsNullOrEmpty(aniListAccessToken))
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenProtector.Unprotect(aniListAccessToken));
            }
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
