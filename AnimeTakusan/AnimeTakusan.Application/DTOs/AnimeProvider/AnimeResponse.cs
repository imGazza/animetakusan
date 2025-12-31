namespace AnimeTakusan.Application.DTOs.AnimeProvider;

public record AnimeResponse
{
    public int Id { get; init; }
    public Title Title { get; init; }
}

public record Title
{
    public string Romaji { get; init; }
    public string English { get; init; }
    public string Native { get; init; }
}