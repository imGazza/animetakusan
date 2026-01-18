using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.Application.Services;

public class AnimeService : IAnimeService, IInjectable
{
    private readonly IAnimeProvider _animeProvider;

    public AnimeService(IAnimeProvider animeProvider)
    {
        _animeProvider = animeProvider;
    }

    public async Task<AnimeResponse> GetAnimeById(int id)
    {        
        return await _animeProvider.GetAnimeById(id);
    }

    public async Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        return await _animeProvider.GetSeasonalAnime(animeSeasonalRequest);
    }

    public async Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBroseSectionRequest animeBroseSectionRequest)
    {
        return await _animeProvider.GetAnimeBrowseSection(animeBroseSectionRequest);
    }
}
