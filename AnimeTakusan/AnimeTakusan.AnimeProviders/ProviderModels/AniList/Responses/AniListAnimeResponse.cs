
namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList.Responses;

public class AniListAnimeResponse
{
    public int Id { get; set; }
    public AniListTitle Title { get; set; }
}

public class AniListTitle
{
    public string English { get; set; }
    public string Romaji { get; set; }
    public string Native { get; set; }
}
