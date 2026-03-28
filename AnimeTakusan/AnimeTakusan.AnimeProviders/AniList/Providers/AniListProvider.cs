using AnimeTakusan.AnimeProviders.AniListSchema;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Exceptions.GraphQLExceptions;
using Mapster;
using StrawberryShake;

namespace AnimeTakusan.AnimeProviders.AniList.Providers;

public class AniListProvider : IAnimeProvider
{
    private readonly IAniListClient _client;
    private const string ProviderName = "AniList";

    public AniListProvider(IAniListClient client)
    {
        _client = client;
    }

    public async Task<AnimeResponse> GetAnimeById(int id)
    {
        var response = await _client.GetAnimeById.ExecuteAsync(id);

        EnsureNoErrors(response);
        return response.Data.Media.Adapt<AnimeResponse>();
    }

    public async Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        var response = await _client.GetSeasonalAnime.ExecuteAsync(
            ParseEnumOrDefault(animeSeasonalRequest.Season.ToString(), MediaSeason.Winter),
            animeSeasonalRequest.SeasonYear,
            new List<MediaSort?> { ParseEnumOrDefault(animeSeasonalRequest.Sort, MediaSort.PopularityDesc) },
            animeSeasonalRequest.Page,
            animeSeasonalRequest.PerPage
        );

        EnsureNoErrors(response);
        return response.Data.Page.Adapt<AnimePageResponse>();
    }

    public async Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBrowseSectionRequest animeBroseSectionRequest)
    {
        var response = await _client.GetBrowseSection.ExecuteAsync(
            ParseEnumOrDefault(animeBroseSectionRequest.Season, MediaSeason.Winter),
            animeBroseSectionRequest.SeasonYear,
            ParseEnumOrDefault(animeBroseSectionRequest.NextSeason, MediaSeason.Winter),
            animeBroseSectionRequest.NextSeasonYear,
            ParseEnumOrDefault(animeBroseSectionRequest.LastSeason, MediaSeason.Winter),
            animeBroseSectionRequest.LastSeasonYear
        );

        EnsureNoErrors(response);
        return response.Data.Adapt<AnimeBrowseResponse>();
    }

    public async Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest)
    {
        var response = await _client.GetAnime.ExecuteAsync(
            animeFilterRequest.Page,
            animeFilterRequest.PerPage,
            animeFilterRequest.Search,
            ParseEnumOrNull<MediaFormat>(animeFilterRequest.Format),
            animeFilterRequest.GenreIn,
            animeFilterRequest.AverageScoreGreater,            
            ParseEnumOrNull<MediaSeason>(animeFilterRequest.Season),
            animeFilterRequest.SeasonYear,
            ParseEnumOrNull<MediaStatus>(animeFilterRequest.Status)
        );

        EnsureNoErrors(response);
        return response.Data.Page.Adapt<AnimePageResponse>();
    }

    // Currently declared the methods here as I don't plan to have multiple providers.
    // If more providers are added in the future, this will be probably moved in a base class.
    private void EnsureNoErrors(IOperationResult operationResult)
    {
        try
        {
            operationResult.EnsureNoErrors();
        }
        catch (GraphQLClientException)
        {
            throw new GraphQLQueryFailedException(ProviderName, operationResult.Errors.Select(e => e.Message).ToList());
        }
    }

    private static TEnum ParseEnumOrDefault<TEnum>(string value, TEnum defaultValue) where TEnum : struct, Enum
    {
        return Enum.TryParse<TEnum>(value, ignoreCase: true, out var result) 
            ? result 
            : defaultValue;
    }

    private static TEnum? ParseEnumOrNull<TEnum>(string value) where TEnum : struct, Enum
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return Enum.TryParse<TEnum>(value, ignoreCase: true, out var result) ? result : null;
    }
}
