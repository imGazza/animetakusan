using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeProvider
{
    //Task<List<Anime>> GetSeasonalAnime(string season);
    Task<AnimeResponse> GetAnimeById(int id);
}
