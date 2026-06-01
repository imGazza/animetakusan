using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

public record AnimeEntryUpsertRequest
{
    public int MediaId { get; init; }
    public int? Progress { get; init; }
    public AnimeMediaListStatus? Status { get; init; }
    public DetailedDate CompletedAt { get; init; }
    public DetailedDate StartedAt { get; init; }
    public int? Score { get; init; }
}
