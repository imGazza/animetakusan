namespace AnimeTakusan.MAL.Domain.Exception.SyncActionExceptions;

public class SyncActionException : System.Exception
{
    public SyncActionException(string message) : base(message) { }
}
