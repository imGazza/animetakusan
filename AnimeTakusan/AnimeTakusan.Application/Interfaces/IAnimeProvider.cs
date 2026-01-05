using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeProvider
{
    Task<List<AnimeResponse>> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest);
    Task<AnimeResponse> GetAnimeById(int id);
}
