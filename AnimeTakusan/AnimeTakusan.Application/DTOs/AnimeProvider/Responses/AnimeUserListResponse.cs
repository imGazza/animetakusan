namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record AnimeUserLibraryResponse
{
    public List<AnimeUserList> Lists { get; init; }
}

public record AnimeUserList
{
    public string Name { get; init; }
    public List<AnimeListEntry> Entries { get; init; }
}

public record AnimeListEntry
{        
    public Anime Anime { get; init; }
}
