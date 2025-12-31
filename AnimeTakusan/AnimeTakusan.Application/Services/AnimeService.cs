using AnimeTakusan.Application.DTOs.AnimeProvider;
using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.Application.Services;

public class AnimeService : IAnimeService, IInjectable
{
    private readonly IAnimeProvider _animeProvider;

    public AnimeService(IAnimeProvider animeProvider)
    {
        _animeProvider = animeProvider;
    }

    public Task<AnimeResponse> GetAnimeById(int id)
    {        
        return _animeProvider.GetAnimeById(id);
    }
}
