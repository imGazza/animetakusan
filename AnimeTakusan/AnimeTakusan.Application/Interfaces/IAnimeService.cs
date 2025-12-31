using AnimeTakusan.Application.DTOs.AnimeProvider;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeService
{
    Task<AnimeResponse> GetAnimeById(int id);
}
