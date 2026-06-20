using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeService
{
    Task<Anime> GetAnimeById(int id);
    Task<AnimePageResponse> GetSeasonalAnime();
    Task<AnimeBrowseResponse> GetAnimeBrowseSection();
    Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest);
    Task<AnimeUserLibraryResponse> GetUserAnimeLibrary(int userId);
    Task<AnimeEntryUpsertResponse> UpsertAnimeEntry(AnimeEntryUpsertRequest animeEntryUpsertRequest);
    Task<ToggleFavouriteResponse> ToggleFavourite(int animeId);
    Task<DeleteAnimeEntryResponse> DeleteAnimeEntry(int animeEntryId);
}
