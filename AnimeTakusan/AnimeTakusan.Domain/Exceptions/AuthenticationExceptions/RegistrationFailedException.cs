namespace AnimeTakusan.Domain.Exceptions;

public class RegistrationFailedException : Exception
{
    public RegistrationFailedException(string email) : base($"Registration failed for user with email {email}")
    {
        
    }
}