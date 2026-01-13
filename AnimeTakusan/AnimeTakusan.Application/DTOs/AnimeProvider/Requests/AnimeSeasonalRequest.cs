namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public record AnimeSeasonalRequest
{
    public required string Season { get; init; }
    public required int SeasonYear { get; init; }
    public string Sort { get; init; }
    public int Page { get; init; } = 1;
    public int PerPage { get; init; } = 20;
}
