using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeProvider
{
    Task<ViewerInfoResponse> GetViewerInfo();
    Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest);
    Task<AnimeDetailResponse> GetAnimeById(int id);
    Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBrowseSectionRequest animeBroseSectionRequest);
    Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest);
    Task<AnimeUserLibraryResponse> GetUserAnimeLibrary(int aniListUserId);
    Task<AnimeEntryUpsertResponse> UpsertAnimeEntry(AnimeEntryUpsertRequest upsertRequest);
    Task<ToggleFavouriteResponse> ToggleFavourite(int animeId);
    Task<DeleteAnimeEntryResponse> DeleteAnimeEntry(int animeEntryId);
}
