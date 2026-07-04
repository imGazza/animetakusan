using AnimeTakusan.Application.Caching;
using AnimeTakusan.Infrastructure.RabbitMQ;
using AnimeTakusan.Infrastructure.RabbitMQ.Options;

namespace AnimeTakusan.API.Extensions;

public static class ConfigurationOptionsExtensions
{
    public static void AddConfigurationOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<CacheOptions>()
            .Bind(configuration.GetSection(CacheOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.Configure<RabbitMqOptions>(configuration.GetSection(RabbitMqOptions.SectionName));
        services.Configure<MalAuthEventOptions>(configuration.GetSection(MalAuthEventOptions.SectionName));
        services.Configure<MalSyncActionOptions>(configuration.GetSection(MalSyncActionOptions.SectionName));
    }
}
