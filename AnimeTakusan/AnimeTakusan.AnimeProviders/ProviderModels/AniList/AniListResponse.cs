namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList;

public record AniListResponse<T>
{
    public required T Media { get; set; }
}
