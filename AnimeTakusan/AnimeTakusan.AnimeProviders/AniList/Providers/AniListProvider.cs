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

    // Kept for now, maybe to remove in the future if not needed.
    public async Task<Anime> GetAnimeById(int id)
    {
        var response = await _client.GetAnimeById.ExecuteAsync(id);

        EnsureNoErrors(response);
        return response.Data.Media.Adapt<Anime>();
    }

    // Kept for now, maybe to remove in the future if not needed.
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

    public async Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBrowseSectionRequest animeBrowseSectionRequest)
    {
        var response = await _client.GetBrowseSection.ExecuteAsync(
            ParseEnumOrDefault(animeBrowseSectionRequest.Season, MediaSeason.Winter),
            animeBrowseSectionRequest.SeasonYear,
            ParseEnumOrDefault(animeBrowseSectionRequest.NextSeason, MediaSeason.Winter),
            animeBrowseSectionRequest.NextSeasonYear,
            ParseEnumOrDefault(animeBrowseSectionRequest.LastSeason, MediaSeason.Winter),
            animeBrowseSectionRequest.LastSeasonYear
        );

        EnsureNoErrors(response);
        return response.Data.Adapt<AnimeBrowseResponse>();
    }

    public async Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest)
    {
        var response = await _client.GetAnime.ExecuteAsync(
            animeFilterRequest.Page.Page,
            animeFilterRequest.Page.PerPage,
            animeFilterRequest.Filter?.Search,
            ParseEnumOrNull<MediaFormat>(animeFilterRequest.Filter?.Format),
            animeFilterRequest.Filter?.GenreIn,
            animeFilterRequest.Filter?.AverageScoreGreater,
            ParseEnumOrNull<MediaSeason>(animeFilterRequest.Filter?.Season),
            animeFilterRequest.Filter?.SeasonYear,
            ParseEnumOrNull<MediaStatus>(animeFilterRequest.Filter?.Status),
            new List<MediaSort?> { ParseEnumOrDefault(animeFilterRequest.Sort, MediaSort.PopularityDesc) }
        );

        EnsureNoErrors(response);
        return response.Data.Page.Adapt<AnimePageResponse>();
    }

    public async Task<AnimeUserListResponse> GetUserAnimeList(int aniListUserId)
    {
        var response = await _client.GetUserAnimeList.ExecuteAsync(
            aniListUserId
        );

        EnsureNoErrors(response);
        return response.Data.MediaListCollection.Adapt<AnimeUserListResponse>();
    }

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
