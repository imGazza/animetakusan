namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public record AnimeFilterRequest
{
    public AnimePage Page { get; set; }
    public AnimeFilter Filter { get; set; }    
}

public record AnimePage
{
    public int Page { get; init; } = 1;
    public int PerPage { get; init; } = 20;
}

public record AnimeFilter
{
    public string Search { get; set; }
    public string Format { get; set; }
    public List<string> GenreIn { get; set; } = null;
    public int? AverageScoreGreater { get; set; }
    public string Season { get; set; }
    public int? SeasonYear { get; set; }
    public string Status { get; set; }
}