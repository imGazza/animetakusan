namespace AnimeTakusan.Domain.Exceptions;

public class LoginFailedException : Exception
{
    public LoginFailedException() : base($"Invalid email or password")
    {
        
    }
}