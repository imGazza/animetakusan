namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeDetailResponse : Anime
{
    public List<Relation> Relations { get; init; }
}

public record Relation
{
    public int Id { get; init; }
    public CoverImage CoverImage { get;init; }
    public Title Title { get; init; }
    public string RelationType { get; init; }
}