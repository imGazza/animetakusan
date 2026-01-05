using AnimeTakusan.AnimeProviders;
using AnimeTakusan.AnimeProviders.Helpers;
using AnimeTakusan.Application.Interfaces;
using GraphQL.Client.Http;

namespace AnimeTakusan.API.Extensions;

public static class AnimeProviderExtensions
{
    public static IServiceCollection AddAniListAnimeProvider(this IServiceCollection services, IConfiguration configuration)
    {
        if(configuration["AniList:ApiUrl"] == null)
            throw new ArgumentNullException("AniList API URL is not configured");

        services.AddSingleton<IQueryLoader, QueryLoader>();
        services.AddScoped<IAnimeProvider, AniListProvider>();

        services.AddHttpClient<IGraphQLClientHelper, GraphQLClientHelper>(client =>
        {
            client.BaseAddress = new Uri(configuration["AniList:ApiUrl"]!);
        })
        .AddStandardResilienceHandler();
        
        return services;
    }
}
