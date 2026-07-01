using AnimeTakusan.MAL.Application.DTOs.Common;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain.Exception.MalAuthExceptions;

namespace AnimeTakusan.MAL.API.Handlers;

public class MalAuthExceptionMapper : IExceptionMapper
{
    public bool CanHandle(Exception exception)
    {
        return exception is MalAuthException;
    }

    public ExceptionDetails MapException(Exception exception)
    {
        return exception switch
        {
            MalAuthException => new ExceptionDetails
            {
                StatusCode = System.Net.HttpStatusCode.BadRequest,
                Message = exception.Message
            },
            _ => throw new ArgumentException("Exception type not supported by this mapper.", nameof(exception))
        };
    }
}
