using System.Text;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.AnimeProviders.AniList.Helpers.HttpHandlers;

/// <summary>
/// Removes null-valued variables from GraphQL Query operations so they are omitted
/// Leave Mutation operations unchanged to preserve intended null values
/// </summary>
public class NullGraphQLVariablesHandler : DelegatingHandler
{
    private readonly ILogger<NullGraphQLVariablesHandler> _logger;

    public NullGraphQLVariablesHandler(ILogger<NullGraphQLVariablesHandler> logger)
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
            var json = JsonNode.Parse(body);

            if (json is JsonObject jsonObject &&
                jsonObject["variables"] is JsonObject variables)
            {
                var nullKeys = variables
                    .Where(kv => kv.Value is null)
                    .Select(kv => kv.Key)
                    .ToList();                

                foreach (var key in nullKeys)
                    variables.Remove(key);

                if(nullKeys.Any())
                    _logger.LogDebug("Removed null-valued variables from the GraphQL request: {NullKeys}", string.Join(", ", nullKeys));

                var sanitized = json.ToJsonString();

                request.Content = new StringContent(
                    sanitized,
                    Encoding.UTF8,
                    "application/json");
            }
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
