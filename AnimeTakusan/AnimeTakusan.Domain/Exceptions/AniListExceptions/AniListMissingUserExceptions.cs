namespace AnimeTakusan.Domain.Exceptions.AniListExceptions;

public class AniListMissingUserException : Exception
{
    public AniListMissingUserException(string message) : base(message)
    {
    }
}
