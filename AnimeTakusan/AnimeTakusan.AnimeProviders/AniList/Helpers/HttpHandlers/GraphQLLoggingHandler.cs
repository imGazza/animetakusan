using Microsoft.Extensions.Logging;

namespace AnimeTakusan.AnimeProviders.AniList.Helpers.HttpHandlers;

public class GraphQLLoggingHandler : DelegatingHandler
{
    private readonly ILogger<GraphQLLoggingHandler> _logger;

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
            _logger.LogDebug("GraphQL Request: {Body}", body);

            // Re-set the content so downstream handlers can still read it
            request.Content = new StringContent(body, System.Text.Encoding.UTF8, "application/json");
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
