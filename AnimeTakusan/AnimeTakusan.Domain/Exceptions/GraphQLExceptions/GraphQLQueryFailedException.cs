using System.Net;

namespace AnimeTakusan.Domain.Exceptions.GraphQLExceptions;

public class GraphQLQueryFailedException : Exception
{
    private readonly List<GraphQLQueryFailedError> _errors;
    public List<GraphQLQueryFailedError> Errors => _errors;

    public GraphQLQueryFailedException(string providerName, List<GraphQLQueryFailedError> errors) : base($"{providerName} query failed: {string.Join(", ", errors.Select(e => e.Message))}")
    {
        _errors = errors;
    }

    public record GraphQLQueryFailedError(string Message, HttpStatusCode Code);
}
