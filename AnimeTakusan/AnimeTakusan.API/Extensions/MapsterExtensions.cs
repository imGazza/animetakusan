using AnimeTakusan.AnimeProviders.AniList.Mappers;
using AnimeTakusan.Application.Handlers.Mappers;
using Mapster;
using System.Reflection;

namespace AnimeTakusan.API.Extensions;

/// <summary>
/// Extension methods for configuring Mapster mapping in the application.
/// </summary>
public static class MapsterExtensions
{
    public static IServiceCollection AddMapster(this IServiceCollection services)
    {
        // Assemblies to scan for IRegister implementations
        List<Assembly> assemblies = new()
        {
            typeof(IAnimeProviderMapper).Assembly,
            typeof(IUserMapper).Assembly
        };

        TypeAdapterConfig.GlobalSettings.Scan(assemblies.ToArray());

        return services;
    }
}
