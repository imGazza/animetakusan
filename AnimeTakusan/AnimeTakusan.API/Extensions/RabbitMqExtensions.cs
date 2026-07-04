using AnimeTakusan.API.Handlers.ConsumerHandlers;
using AnimeTakusan.Application.Handlers.ConsumerHandlers;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.RabbitMq;
using AnimeTakusan.Infrastructure.RabbitMQ;

namespace AnimeTakusan.API.Extensions;

public static class RabbitMqExtensions
{
    public static IServiceCollection AddRabbitMqConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<IRabbitMqConnectionManager, RabbitMqConnectionManager>();
        services.AddSingleton<IMessagePublisher, RabbitMqPublisher>();
        services.AddScoped<IMessageHandler, MalAuthEventHandler>();
        services.AddSingleton<RabbitMqInitializer>();
        services.AddHostedService<RabbitMqConsumerService>();

        return services;
    }
}
