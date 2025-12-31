using AnimeTakusan.AnimeProviders.Helpers;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList;
using AnimeTakusan.AnimeProviders.Queries;
using AnimeTakusan.Application.DTOs.AnimeProvider;
using AnimeTakusan.Application.Interfaces;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.SystemTextJson;
using Mapster;

namespace AnimeTakusan.AnimeProviders;

public class AniListProvider : IAnimeProvider
{
    private readonly GraphQLHttpClient _client;
    private readonly QueryLoader _queryLoader;

    public AniListProvider(QueryLoader queryLoader)
    {
        _client = new GraphQLHttpClient("https://graphql.anilist.co", new SystemTextJsonSerializer());
        _queryLoader = queryLoader;
    }

    public async Task<AnimeResponse> GetAnimeById(int id)
    {
        var query = await _queryLoader.LoadQueryAsync(AniListQueryIndex.GetAnimeById);

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = new { id }
        };

        var response = await _client.SendQueryAsync<AniListAnimeResponse>(request);

        return response.Data.Media.Adapt<AnimeResponse>();
    }
}
