namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList.Requests;

public record AniListSeasonalRequest
{
    public required AniListSeason Season { get; init; }
    public required int SeasonYear { get; init; }
    public AniListSort Sort { get; init; } = AniListSort.POPULARITY_DESC;
    public required int Page { get; init; }
    public required int PerPage { get; init; }
}

public enum AniListSeason
{
    WINTER,
    SPRING,
    SUMMER,
    FALL
}

public enum AniListSort
{
    POPULARITY_DESC,
    POPULARITY_ASC,
    TITLE_ROMAJI_DESC,
    TITLE_ROMAJI_ASC,
    START_DATE_DESC,
    START_DATE_ASC
}
