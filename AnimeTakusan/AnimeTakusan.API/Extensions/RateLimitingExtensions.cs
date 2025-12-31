using Microsoft.AspNetCore.RateLimiting;

namespace AnimeTakusan.API.Extensions;

public static class RateLimitingExtensions
{
    public static IServiceCollection AddRateLimiting(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            AuthRateLimiting(options);
            TokenRateLimiting(options);
        });
        return services;
    }

    private static void AuthRateLimiting(RateLimiterOptions options)
    {
        options.AddFixedWindowLimiter("auth", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 5;
        });        
    }

    private static void TokenRateLimiting(RateLimiterOptions options)
    {
        options.AddFixedWindowLimiter("token", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 50;
            opt.QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst;
            opt.QueueLimit = 20;
        });
    }

    private static void AnimeRateLimiting(RateLimiterOptions options)
    {
        options.AddFixedWindowLimiter("anime", opt =>
        {
            opt.Window = TimeSpan.FromMinutes(1);
            opt.PermitLimit = 50;
            opt.QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst;
            opt.QueueLimit = 20;
        });
    }
}
