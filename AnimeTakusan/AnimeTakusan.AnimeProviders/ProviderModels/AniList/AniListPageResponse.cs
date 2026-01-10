namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList.Responses;

public record AniListPageResponse<T>
{
    public required AniListPage<T> Page { get; set; }
}

public record AniListPage<T>
{
    public required AniListPageInfo PageInfo { get; init; }
    public required List<T> Media { get; init; }
}

public record AniListPageInfo
{
    public int PerPage { get; init; }
    public int CurrentPage { get; init; }
    public bool HasNextPage { get; init; }
}
