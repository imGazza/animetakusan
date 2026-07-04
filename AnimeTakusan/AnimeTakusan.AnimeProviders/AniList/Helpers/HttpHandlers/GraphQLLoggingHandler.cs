using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.AnimeProviders.AniList.Helpers.HttpHandlers;

public class GraphQLLoggingHandler : DelegatingHandler
{
    private readonly ILogger<GraphQLLoggingHandler> _logger;

    private static readonly JsonSerializerOptions IndentedJson = new() { WriteIndented = true };

    public GraphQLLoggingHandler(ILogger<GraphQLLoggingHandler> logger)
    {
        _logger = logger;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        if (request.Content is not null)
        {
            var body = await request.Content.ReadAsStringAsync(cancellationToken);

            if (_logger.IsEnabled(LogLevel.Debug))
            {
                var (query, variables) = ParseGraphQL(body);
                _logger.LogDebug(
                    "GraphQL Request:\n{Query}\nVariables: {Variables}",
                    query,
                    variables);
            }

            // Re-set the content so downstream handlers can still read it
            request.Content = new StringContent(body, Encoding.UTF8, "application/json");
        }

        return await base.SendAsync(request, cancellationToken);
    }

    private static (string Query, string Variables) ParseGraphQL(string body)
    {
        try
        {
            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;

            // Deserializing the "query" string turns the escaped \n back into real newlines.
            var query = root.TryGetProperty("query", out var q)
                ? q.GetString() ?? body
                : body;

            var variables = root.TryGetProperty("variables", out var v)
                ? JsonSerializer.Serialize(v, IndentedJson)
                : "{}";

            return (query, variables);
        }
        catch (JsonException)
        {
            // Not a JSON GraphQL payload — log the raw body as a fallback.
            return (body, "{}");
        }
    }
}
