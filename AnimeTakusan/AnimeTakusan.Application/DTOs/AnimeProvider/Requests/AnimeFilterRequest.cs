namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public class AnimeFilterRequest
{
    public int Page { get; set; } = 1;
    public int PerPage { get; set; } = 20;
    public string Search { get; set; }
    public string Format { get; set; }
    public List<string> GenreIn { get; set; } = null;
    public int? AverageScoreGreater { get; set; }
    public string Season { get; set; }
    public int? SeasonYear { get; set; }
    public string Status { get; set; }
}
