using AnimeTakusan.AnimeProviders.Helpers;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList;
using AnimeTakusan.AnimeProviders.Queries;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using GraphQL;
using Mapster;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.AnimeProviders;

public class AniListProvider : IAnimeProvider
{
    private readonly GraphQLClientHelper _client;
    private readonly IQueryLoader _queryLoader;
    private readonly ILogger<AniListProvider> _logger;

    public AniListProvider(GraphQLClientHelper client, IQueryLoader queryLoader, ILogger<AniListProvider> logger)
    {
        _client = client;
        _queryLoader = queryLoader;
        _logger = logger;
    }

    public async Task<AnimeResponse> GetAnimeById(int id)
    {
        var query = await _queryLoader.LoadQueryAsync(AniListQueryIndex.GetAnimeById);

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = new { id }
        };

        var response = await _client.SendQueryAsync<AniListResponse<AniListAnime>>(request);

        return response.Data.Media.Adapt<AnimeResponse>();
    }
}
