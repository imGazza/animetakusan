using System;

namespace AnimeTakusan.Domain.Exceptions.AniListProviderExceptions;

public class QueryFailedException : Exception
{
    public QueryFailedException(List<string> errorMessages) : base($"AniList query failed: {string.Join(", ", errorMessages)}")
    {
        
    }
}
