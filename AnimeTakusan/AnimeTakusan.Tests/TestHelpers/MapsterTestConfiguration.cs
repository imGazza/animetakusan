using AnimeTakusan.AnimeProviders.Mappers;
using Mapster;

namespace AnimeTakusan.Tests.TestHelpers;

/// <summary>
/// Provides Mapster configuration setup for unit tests.
/// Ensures all mapper configurations are registered before test execution.
/// </summary>
public static class MapsterTestConfiguration
{
    private static bool _isConfigured;
    private static readonly object _lock = new();
    public static void ConfigureMapster()
    {
        if (_isConfigured) return;

        lock (_lock)
        {
            if (_isConfigured) return;

            // Clear any existing configurations to ensure clean state
            TypeAdapterConfig.GlobalSettings.Scan(typeof(IAnimeProviderMapper).Assembly);

            _isConfigured = true;
        }
    }
}
