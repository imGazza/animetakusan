using System.Net;
using AnimeTakusan.Application.DTOs.Common.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Exceptions.AniListExceptions;
using AnimeTakusan.Domain.Exceptions.GraphQLExceptions;

namespace AnimeTakusan.API.Handlers.Mappers;

public class AniListExceptionMapper : IExceptionMapper
{
    public bool CanHandle(Exception exception)
    {
        return exception is GraphQLQueryFailedException or GraphQLMissingRequestException or AniListMissingUserException;
    }

    public ExceptionDetails MapException(Exception exception)
    {
        return exception switch
        {
            GraphQLQueryFailedException => new ExceptionDetails
            {
                StatusCode = ((GraphQLQueryFailedException)exception).Errors.FirstOrDefault()?.Code ?? HttpStatusCode.BadRequest,
                Message = exception.Message
            },
            GraphQLMissingRequestException => new ExceptionDetails
            {
                StatusCode = HttpStatusCode.BadRequest,
                Message = exception.Message
            },            
            AniListMissingUserException => new ExceptionDetails
            {
                StatusCode = HttpStatusCode.BadRequest,
                Message = exception.Message
            },
            // Should never reach here due to CanHandle check.
            // GlobalExceptionHandler will use default mapping in that case.
            _ => throw new Exception("An AniList provider error occurred.")
        };
    }
}
