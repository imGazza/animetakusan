using AnimeTakusan.MAL.Application.DTOs.Common;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain.Exception.SyncActionExceptions;

namespace AnimeTakusan.MAL.API.Handlers;

public class SyncActionExceptionMapper : IExceptionMapper
{
    public bool CanHandle(Exception exception)
    {
        return exception is SyncActionException;
    }

    public ExceptionDetails MapException(Exception exception)
    {
        return exception switch
        {
            SyncActionException => new ExceptionDetails
            {
                StatusCode = System.Net.HttpStatusCode.BadRequest,
                Message = exception.Message
            },
            _ => throw new ArgumentException("Exception type not supported by this mapper.", nameof(exception))
        };
    }
}
