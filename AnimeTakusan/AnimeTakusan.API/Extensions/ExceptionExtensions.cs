using System;
using AnimeTakusan.API.Handlers;
using AnimeTakusan.API.Handlers.Mappers;
using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.API.Extensions;

public static class ExceptionExtensions
{
    public static IServiceCollection AddExceptionHandling(this IServiceCollection services)
    {
        // Register exception mappers
        services.AddSingleton<IExceptionMapper, AuthenticationExceptionMapper>();
        
        // Register global exception handler
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();
        
        return services;
    }
}
