namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList;

public class AniListAnimeResponse
{
    public AniListMedia Media { get; set; }
}

public class AniListMedia
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
