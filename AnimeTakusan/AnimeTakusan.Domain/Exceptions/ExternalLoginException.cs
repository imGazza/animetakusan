namespace AnimeTakusan.Infrastructure.Exceptions;

public class ExternalLoginException : Exception
{
    public ExternalLoginException(string provider, string message) : base($"External login with {provider} failed: {message}")
    {
        
    }
}
