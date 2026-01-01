using AnimeTakusan.Domain.Exceptions.AniListProviderExceptions;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;

namespace AnimeTakusan.AnimeProviders.Helpers;

/// <summary>
/// Wrapper for GraphQLHttpClient based on IHttpClientFactory to correctly manage HttpClient disposition
/// Definition in Program.cs
/// </summary>
public class GraphQLClientHelper
{
    private readonly HttpClient _httpClient;
    private GraphQLHttpClient _graphQlClient;

    public GraphQLClientHelper(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _graphQlClient = new GraphQLHttpClient(_httpClient.BaseAddress, new SystemTextJsonSerializer(), _httpClient);
    }

    public async Task<GraphQLResponse<T>> SendQueryAsync<T>(GraphQLRequest request)
    {
        if (request == null)
        {
            throw new MissingRequestException();
        }

        var response = await _graphQlClient.SendQueryAsync<T>(request);

        if(response.Errors != null && response.Errors.Any())
        {
            throw new QueryFailedException(response.Errors.Select(e => e.Message).ToList());
        }

        return response;
    }

}
