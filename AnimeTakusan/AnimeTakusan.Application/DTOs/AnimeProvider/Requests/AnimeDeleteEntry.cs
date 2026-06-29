namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public record AnimeDeleteEntry
{
    public int MediaListEntryId { get; set; }
    public int MalId { get; set; }
}
