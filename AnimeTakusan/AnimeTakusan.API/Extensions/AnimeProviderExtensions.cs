using System;
using AnimeTakusan.AnimeProviders;
using AnimeTakusan.AnimeProviders.Queries;
using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.API.Extensions;

public static class AnimeProviderExtensions
{
    public static IServiceCollection AddAnimeProvider(this IServiceCollection services)
    {
        services.AddSingleton<QueryLoader>();
        services.AddScoped<IAnimeProvider, AniListProvider>();
        
        return services;
    }
}
