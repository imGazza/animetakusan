namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeDetailResponse : Anime
{
    public AnimeSource Source { get; init; }
    public int Popularity { get; init; }
    public int Favourites { get; init; }
    public List<Relation> Relations { get; init; }
    public List<Recommendation> Recommendations { get; init; }
    public List<Review> Reviews { get; init; }
    public List<Ranking> Rankings { get; init; }
}

public record Relation
{
    public int Id { get; init; }
    public SmallCoverImage CoverImage { get;init; }
    public Title Title { get; init; }
    public string RelationType { get; init; }
    public AnimeFormat Format { get; init; }
    public AnimeStatus Status { get; init; } 
    public MediaType Type { get; init; }
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

public record Review
{
    public int RatingAmount { get; init; }
    public int Rating { get; init; }
    public int Score { get; init; }
    public string Summary { get; init; }
    public string SiteUrl { get; init; }
    public User User { get; init; }
}

public record User
{
    public string Name { get; init; }
    public string Avatar { get; init; }
}

public record Ranking
{
    public int Rank { get; init; }
    public string Context { get; init; }
    public string Type { get; init; }
    public bool AllTime { get; init; }
    public AnimeSeason? Season { get; init; }
    public int? Year { get; init; }
}


