namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeUserListResponse
{
    public AnimeUserList[] Lists { get; init; }
}

public record AnimeUserList
{
    public string Name { get; init; }
    public AnimeListEntry[] Entries { get; init; }
}

public record AnimeListEntry
{        
    public Anime Anime { get; init; }
}
