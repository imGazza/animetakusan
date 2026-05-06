namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeDetailResponse : Anime
{
    public AnimeSource Source { get; init; }
    public int Popularity { get; init; }
    public int Favourites { get; init; }
    public List<Relation> Relations { get; init; }
    public List<Recommendation> Recommendations { get; init; }
}

public record Relation
{
    public int Id { get; init; }
    public SmallCoverImage CoverImage { get;init; }
    public Title Title { get; init; }
    public string RelationType { get; init; }
    public AnimeFormat Format { get; init; }
    public AnimeStatus Status { get; init; } 
}

public record Recommendation
{
    public int Id { get; init; }
    public SmallCoverImage CoverImage { get; init; }
    public Title Title { get; init; }
    public int AverageScore { get; init; }
}

public record SmallCoverImage {
    public string Large { get; init; }
    public string Color { get; init; }
}

