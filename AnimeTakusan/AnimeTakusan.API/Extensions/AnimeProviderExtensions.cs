using AnimeTakusan.AnimeProviders.AniList.Helpers.HttpHandlers;
using AnimeTakusan.AnimeProviders.AniList.Providers;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Infrastructure.Authentication;
using StrawberryShake;

namespace AnimeTakusan.API.Extensions;

public static class AnimeProviderExtensions
{
    public static IServiceCollection AddAniListAnimeProvider(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration["AniList:ApiUrl"] == null)
            throw new ArgumentNullException("AniList API URL is not configured");

        services.AddScoped<IAnimeProvider, AniListProvider>();
        services.AddTransient<NullGraphQLVariablesHandler>();
        services.AddTransient<AniListAuthenticationHandler>();
        services.AddTransient<GraphQLLoggingHandler>();

        services.AddAniListClient(ExecutionStrategy.CacheFirst)
            .ConfigureHttpClient(
                client =>
                {
                    client.BaseAddress = new Uri(configuration["AniList:ApiUrl"]!);
                    client.Timeout = TimeSpan.FromSeconds(30);
                },
                builder =>
                {
                    builder.AddHttpMessageHandler<GraphQLLoggingHandler>();
                    builder.AddHttpMessageHandler<AniListAuthenticationHandler>();
                    builder.AddHttpMessageHandler<NullGraphQLVariablesHandler>();
                    builder.AddStandardHedgingHandler();
                }
            );

        return services;
    }
}
