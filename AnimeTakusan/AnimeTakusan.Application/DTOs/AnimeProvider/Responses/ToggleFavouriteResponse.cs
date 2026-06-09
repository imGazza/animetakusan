namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record ToggleFavouriteResponse
{
    public bool IsMarkedAsFavorite { get; init; }
}
