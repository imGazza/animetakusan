namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public record ToggleFavouriteResponse
{
    public bool IsMarkedAsFavourite { get; init; }
}
