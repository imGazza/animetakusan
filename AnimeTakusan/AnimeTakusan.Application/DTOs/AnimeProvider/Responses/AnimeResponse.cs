namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeResponse
{
    public int Id { get; init; }
    public Title Title { get; init; }
    public CoverImage CoverImage { get; init; }
    public DetailedDate StartDate { get; init; }
    public DetailedDate EndDate { get; init; }
    public string BannerImage { get; init; }
    public AnimeSeason Season { get; init; }
    public int? SeasonYear { get; init; }
    public string Description { get; init; }
    public AnimeType Type { get; init; }
    public AnimeFormat Format { get; init; }
    public AnimeStatus Status { get; init; }
    public int? Episodes { get; init; }
    public int? Duration { get; init; }
    public List<string> Genres { get; init; }
    public bool? IsAdult { get; init; }
    public int? AverageScore { get; init; }
    public AiringSchedule NextAiringEpisode { get; init; }
    public StudioConnection Studios { get; init; }
}

public record Title
{
    public string Romaji { get; init; }
    public string English { get; init; }
    public string Native { get; init; }
}

public record CoverImage
{
    public string ExtraLarge { get; init; }
    public string Large { get; init; }
    public string Color { get; init; }
}

public record DetailedDate
{
    public int? Year { get; init; }
    public int? Month { get; init; }
    public int? Day { get; init; }
}

public record AiringSchedule
{
    public long AiringAt { get; init; }
    public int TimeUntilAiring { get; init; }
    public int Episode { get; init; }
}

public record StudioConnection
{
    public List<Studio> Nodes { get; init; }
}

public record Studio
{
    public int Id { get; init; }
    public string Name { get; init; }
}

public enum AnimeSeason
{
    WINTER,
    SPRING,
    SUMMER,
    FALL
}

public enum AnimeType
{
    ANIME,
    MANGA
}

public enum AnimeFormat
{
    TV,
    TV_SHORT,
    MOVIE,
    SPECIAL,
    OVA,
    ONA,
    MUSIC
}

public enum AnimeStatus
{
    FINISHED,
    RELEASING,
    NOT_YET_RELEASED,
    CANCELLED,
    HIATUS
}