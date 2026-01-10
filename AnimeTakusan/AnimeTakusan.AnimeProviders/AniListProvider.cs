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

namespace AnimeTakusan.AnimeProviders;

public class AniListProvider : IAnimeProvider
{
    private readonly IGraphQLClientHelper _client;
    private readonly IQueryLoader _queryLoader;
    private const string ProviderName = "AniList";

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

        var response = await SendQuery<AniListResponse<AniListAnimeResponse>>(request);

        return response.Media.Adapt<AnimeResponse>();
    }

    public async Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        var query = await _queryLoader.LoadQueryAsync(AniListQueryIndex.GetSeasonalAnime);

        var request = new GraphQLRequest
        {
            Query = query,
            Variables = new AniListSeasonalRequest
            {
                Season = ParseEnumOrDefault(animeSeasonalRequest.season, AniListSeason.WINTER),
                SeasonYear = animeSeasonalRequest.seasonYear,
                Sort = ParseEnumOrDefault(animeSeasonalRequest.sort, AniListSort.POPULARITY_DESC),
                Page = animeSeasonalRequest.page,
                PerPage = animeSeasonalRequest.perPage
            }
        };

        var response = await SendQuery<AniListPageResponse<AniListAnimeResponse>>(request);
        return response.Page.Adapt<AnimePageResponse>();
    }

    // Currently declared the method here as I don't plan to have multiple providers.
    // If more providers are added in the future, this will be probably moved in a base class.
    private async Task<T> SendQuery<T>(GraphQLRequest request)
    {
        return await _client.SendQueryAsync<T>(request, ProviderName);
    }

    private static TEnum ParseEnumOrDefault<TEnum>(string value, TEnum defaultValue) where TEnum : struct, Enum
    {
        return Enum.TryParse<TEnum>(value, ignoreCase: true, out var result) 
            ? result 
            : defaultValue;
    }
}
