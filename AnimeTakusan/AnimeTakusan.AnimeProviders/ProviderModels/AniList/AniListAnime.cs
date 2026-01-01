
namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList;

public class AniListAnime
{
    public int Id { get; set; }
    public Title Title { get; set; }
}

public class Title
{
    public string English { get; set; }
    public string Romaji { get; set; }
    public string Native { get; set; }
}
