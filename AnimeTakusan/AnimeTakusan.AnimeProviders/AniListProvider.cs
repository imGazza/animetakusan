using AnimeTakusan.AnimeProviders.Helpers;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList.Requests;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList.Responses;
using AnimeTakusan.AnimeProviders.Queries;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using GraphQL;
using Mapster;
using Microsoft.Extensions.Configuration;

namespace AnimeTakusan.AnimeProviders;

public class AniListProvider : IAnimeProvider
{
    private readonly IGraphQLClientHelper _client;
    private readonly IQueryLoader _queryLoader;

    public AniListProvider(IGraphQLClientHelper client, IQueryLoader queryLoader)
    {
        _client = client;
        _queryLoader = queryLoader;
    }

    public async Task<AnimeResponse> GetAnimeById(int id)
    {
        var query = await _queryLoader.LoadQueryAsync(AniListQueryIndex.GetAnimeById);

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = new AniListAnimeRequest { Id = id }
        };

        var response = await _client.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(request);

        return response.Media.Adapt<AnimeResponse>();
    }

    public async Task<List<AnimeResponse>> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        var query = await _queryLoader.LoadQueryAsync(AniListQueryIndex.GetSeasonalAnime);

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = new AniListSeasonalRequest
            {
                Season = Enum.Parse<AniListSeason>(animeSeasonalRequest.season, ignoreCase: true),
                SeasonYear = animeSeasonalRequest.seasonYear,
                Sort = animeSeasonalRequest.sort != null ? Enum.Parse<AniListSort>(animeSeasonalRequest.sort, ignoreCase: true) : AniListSort.POPULARITY_DESC,
                Page = animeSeasonalRequest.page,
                PerPage = animeSeasonalRequest.perPage
            }
        };

        var response = await _client.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(request);
        return response.Page.Media.Adapt<List<AnimeResponse>>();
    }
}
