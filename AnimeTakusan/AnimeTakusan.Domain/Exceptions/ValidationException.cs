namespace AnimeTakusan.Domain.Exceptions.AuthenticationExceptions;

public class ValidationException : Exception
{
    public ValidationException(string message) : base(message)
    {
    }
}
