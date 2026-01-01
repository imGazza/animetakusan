using AnimeTakusan.Application.DTOs.Common.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Exceptions.AniListProviderExceptions;

namespace AnimeTakusan.API.Handlers.Mappers;

public class AniListExceptionMapper : IExceptionMapper
{
    public bool CanHandle(Exception exception)
    {
        return exception is QueryFailedException;
    }

    public ExceptionDetails MapException(Exception exception)
    {

        return exception switch
        {
            QueryFailedException or MissingRequestException => new ExceptionDetails
            {
                StatusCode = System.Net.HttpStatusCode.BadRequest,
                Message = exception.Message
            },
            // Should never reach here due to CanHandle check.
            // GlobalExceptionHandler will use default mapping in that case.
            _ => throw new Exception("An AniList provider error occurred.")
        };
    }
}
