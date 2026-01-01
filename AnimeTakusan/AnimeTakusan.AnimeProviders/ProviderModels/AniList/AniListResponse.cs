namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList;

public record AniListResponse<T>
{
    public T Media { get; set; }
}
