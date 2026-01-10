using AnimeTakusan.AnimeProviders.Mappers;
using AnimeTakusan.Application.Interfaces;
using Mapster;
using MapsterMapper;
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
            typeof(IAnimeProviderMapper).Assembly
        };

        TypeAdapterConfig.GlobalSettings.Scan(assemblies.ToArray());

        return services;
    }
}
