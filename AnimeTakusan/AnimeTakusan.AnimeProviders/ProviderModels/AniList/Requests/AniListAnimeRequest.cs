using System;

namespace AnimeTakusan.AnimeProviders.ProviderModels.AniList.Requests;

public record AniListAnimeRequest
{
    public required int Id { get; init; }
}
