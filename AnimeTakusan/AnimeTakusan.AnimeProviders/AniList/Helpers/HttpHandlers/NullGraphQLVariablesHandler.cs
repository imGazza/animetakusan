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
                // var queryText = jsonObject["query"]?.GetValue<string>() ?? string.Empty;
                // if (queryText.TrimStart().StartsWith("mutation", StringComparison.OrdinalIgnoreCase))
                // {
                //     return await base.SendAsync(request, cancellationToken);
                // }

                var nullKeys = variables
                    .Where(kv => kv.Value is null)
                    .Select(kv => kv.Key)
                    .ToList();                

                foreach (var key in nullKeys)
                    variables.Remove(key);

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
