namespace AnimeTakusan.Domain.Exceptions.GraphQLExceptions;

public class GraphQLQueryFailedException : Exception
{
    public GraphQLQueryFailedException(string providerName, List<string> errorMessages) : base($"{providerName} query failed: {string.Join(", ", errorMessages)}")
    {
        
    }

    public GraphQLQueryFailedException(string providerName, string errorMessage) : base($"{providerName} query failed: {errorMessage}")
    {
        
    }
}
