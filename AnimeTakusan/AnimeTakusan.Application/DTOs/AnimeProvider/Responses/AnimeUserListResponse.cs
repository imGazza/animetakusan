namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeUserListResponse
{
    public AnimeUserList[] Lists { get; set; }
}

public record AnimeUserList
{
    public string Name { get; set; }
    public AnimeListEntry[] Entries { get; set; }
}

public record AnimeListEntry
{        
    public Anime Anime { get; init; }
}
