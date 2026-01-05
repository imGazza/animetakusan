namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeResponse
{
    public int Id { get; set; }
    public Title Title { get; set; }
}

public record Title
{
    public string Romaji { get; set; }
    public string English { get; set; }
    public string Native { get; set; }
}