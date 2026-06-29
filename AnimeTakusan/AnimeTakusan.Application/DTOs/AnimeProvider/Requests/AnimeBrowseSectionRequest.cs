namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public record AnimeBrowseSectionRequest
{
    public required string Season { get; init; }
    public required int SeasonYear { get; init; }
    public required string NextSeason { get; init; }
    public required int NextSeasonYear { get; init; }
    public required string LastSeason { get; init; }
    public required int LastSeasonYear { get; init; }
}
