using AnimeTakusan.Domain.Exceptions.AniListProviderExceptions;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;

namespace AnimeTakusan.AnimeProviders.Helpers;

public interface IGraphQLClientHelper
{
    Task<T> SendQueryAsync<T>(GraphQLRequest request);
}

/// <summary>
/// Wrapper for GraphQLHttpClient based on IHttpClientFactory to correctly manage HttpClient disposition
/// Definition in Program.cs
/// </summary>
public class GraphQLClientHelper : IGraphQLClientHelper
{
    private readonly HttpClient _httpClient;
    private readonly GraphQLHttpClient _graphQlClient;

    public GraphQLClientHelper(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _graphQlClient = new GraphQLHttpClient(_httpClient.BaseAddress, new SystemTextJsonSerializer(), _httpClient);
    }

    public async Task<T> SendQueryAsync<T>(GraphQLRequest request)
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

        return response.Data;
    }

}
