using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeService
{
    Task<AnimeResponse> GetAnimeById(int id);
    Task<AnimePageResponse> GetSeasonalAnime();
    Task<AnimeBrowseResponse> GetAnimeBrowseSection();
}
