using System.Net;
using AnimeTakusan.Application.DTOs.Common.Responses;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Diagnostics;

namespace AnimeTakusan.API.Handlers;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IEnumerable<IExceptionMapper> _exceptionMappers;

    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger,
        IEnumerable<IExceptionMapper> exceptionMappers)
    {
        _logger = logger;
        _exceptionMappers = exceptionMappers;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, exception.Message);

        // Find appropriate mapper
        var mapper = _exceptionMappers.FirstOrDefault(m => m.CanHandle(exception));

        var exceptionDetails = mapper?.MapException(exception)
            ?? GetDefaultExceptionDetails(exception);

        httpContext.Response.StatusCode = (int)exceptionDetails.StatusCode;
        httpContext.Response.ContentType = "application/json";

        await httpContext.Response.WriteAsJsonAsync(exceptionDetails.Message, cancellationToken);

        return true;
    }

    // Default mapping for unhandled exceptions
    private static ExceptionDetails GetDefaultExceptionDetails(Exception exception)
    {
        return new ExceptionDetails
        {
            StatusCode = HttpStatusCode.InternalServerError,
            Message = exception.Message
        };
    }
}
