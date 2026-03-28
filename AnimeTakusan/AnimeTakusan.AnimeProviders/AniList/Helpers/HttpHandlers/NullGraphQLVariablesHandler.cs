using System.Text;
using System.Text.Json.Nodes;

namespace AnimeTakusan.AnimeProviders.AniList.Helpers.HttpHandlers;

/// <summary>
/// Removes null-valued variables from GraphQL requests so they are omitted
/// entirely rather than being serialized as explicit nulls.
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
                var nullKeys = variables
                    .Where(kv => kv.Value is null)
                    .Select(kv => kv.Key)
                    .ToList();

                foreach (var key in nullKeys)
                    variables.Remove(key);

                request.Content = new StringContent(
                    json.ToJsonString(),
                    Encoding.UTF8,
                    "application/json");
            }
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
