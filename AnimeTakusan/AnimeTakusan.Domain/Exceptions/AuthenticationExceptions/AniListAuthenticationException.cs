using System;

namespace AnimeTakusan.Domain.Exceptions.AuthenticationExceptions;

public class AniListAuthenticationException : Exception
{
    public AniListAuthenticationException(string message) : base($"AniList authentication failed: {message}")
    {
        
    }

    public AniListAuthenticationException(string message, Exception ex) : base($"AniList authentication failed: {message}", ex)
    {
        
    }
}
