using System;

namespace AnimeTakusan.Domain.Exceptions;

public class InvalidRefreshTokenException : Exception
{
    public InvalidRefreshTokenException(string message) : base(message)
    {
    }
}
