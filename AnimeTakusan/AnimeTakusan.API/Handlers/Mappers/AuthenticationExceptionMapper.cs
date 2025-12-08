using System;
using AnimeTakusan.Application.DTOs.Common.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Exceptions;

namespace AnimeTakusan.API.Handlers.Mappers;

public class AuthenticationExceptionMapper : IExceptionMapper
{
    public bool CanHandle(Exception exception)
    {
        return exception is ExternalLoginException
            or LoginFailedException
            or RegistrationFailedException
            or RoleAssignmentException
            or RoleCreationException
            or UserAlreadySignedUpException;
    }

    public ExceptionDetails MapException(Exception exception)
    {
        return exception switch
        {
            ExternalLoginException 
                or LoginFailedException => new ExceptionDetails
            {
                StatusCode = System.Net.HttpStatusCode.Unauthorized,
                Message = exception.Message
            },
            RegistrationFailedException 
                or RoleAssignmentException 
                or RoleCreationException => new ExceptionDetails
            {
                StatusCode = System.Net.HttpStatusCode.BadRequest,
                Message = exception.Message
            },
            UserAlreadySignedUpException => new ExceptionDetails
            {
                StatusCode = System.Net.HttpStatusCode.Conflict,
                Message = exception.Message
            },
            // Should never reach here due to CanHandle check.
            // GlobalExceptionHandler will use default mapping in that case.
            _ => throw new Exception("An authentication error occurred.")
        };
    }
}
