namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimePageResponse
{
    public AnimePageInfo Page { get; init; }
    public List<AnimeResponse> Data { get; init; }
}

public record AnimePageInfo
{
    public int PerPage { get; init; }
    public int CurrentPage { get; init; }
    public bool HasNextPage { get; init; }
} 
