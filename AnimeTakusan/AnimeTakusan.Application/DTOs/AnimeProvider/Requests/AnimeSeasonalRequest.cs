namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public record AnimeSeasonalRequest
{
    public required string season { get; init; }
    public required int seasonYear { get; init; }
    public string sort { get; init; }
    public int page { get; init; } = 1;
    public int perPage { get; init; } = 20;
}
