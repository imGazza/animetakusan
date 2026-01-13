using AnimeTakusan.AnimeProviders;
using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.API.Extensions;

public static class AnimeProviderExtensions
{
    public static IServiceCollection AddAniListAnimeProvider(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration["AniList:ApiUrl"] == null)
            throw new ArgumentNullException("AniList API URL is not configured");

        services.AddScoped<IAnimeProvider, AniListProvider>();

        services.ConfigureHttpClientDefaults(http =>
        {
            http.AddStandardResilienceHandler();
        });

        services.AddAniListClient()
            .ConfigureHttpClient(client =>
            {
                client.BaseAddress = new Uri(configuration["AniList:ApiUrl"]!);
                client.Timeout = TimeSpan.FromSeconds(30);
            });
            

        return services;
    }
}
