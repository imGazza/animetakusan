namespace AnimeTakusan.Domain.Exceptions.GraphQLExceptions;

public class GraphQLMissingRequestException : Exception
{
    public GraphQLMissingRequestException(string providerName) : base($"{providerName}: the request is missing")
    {
        
    }
}
