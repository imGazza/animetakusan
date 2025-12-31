using AnimeTakusan.Application.DTOs.AnimeProvider;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeProvider
{
    //Task<List<Anime>> GetSeasonalAnime(string season);
    Task<AnimeResponse> GetAnimeById(int id);
}
