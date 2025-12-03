namespace AnimeTakusan.Domain.Exceptions;

public class UserAlreadySignedUpException : Exception
{
    public UserAlreadySignedUpException(string email) : base($"User with email {email} is already signed up")
    {
        
    }
}
