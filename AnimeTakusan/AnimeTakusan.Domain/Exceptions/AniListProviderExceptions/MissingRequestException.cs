using System;

namespace AnimeTakusan.Domain.Exceptions.AniListProviderExceptions;

public class MissingRequestException : Exception
{
    public MissingRequestException() : base("The request is missing")
    {
        
    }
}
