using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;

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

    public async Task<AnimePageResponse> GetSeasonalAnime()
    {
        var animeSeasonalRequest = CreateAnimeSeasonalRequest();
        return await _animeProvider.GetSeasonalAnime(animeSeasonalRequest);
    }

    private AnimeSeasonalRequest CreateAnimeSeasonalRequest()
    {
        string currentSeason = SeasonUtility.GetCurrentSeason(DateTime.Now);
        int currentSeasonYear = SeasonUtility.GetCurrentSeasonYear(DateTime.Now);
        
        return new AnimeSeasonalRequest
        {
            Season = currentSeason,
            SeasonYear = currentSeasonYear
        };
    }

    public async Task<AnimeBrowseResponse> GetAnimeBrowseSection()
    {
        var animeBrowseSectionRequest = CreateAnimeBrowseSectionRequest();
        return await _animeProvider.GetAnimeBrowseSection(animeBrowseSectionRequest);
    }

    private AnimeBrowseSectionRequest CreateAnimeBrowseSectionRequest()
    {
        string currentSeason = SeasonUtility.GetCurrentSeason(DateTime.Now);
        int currentSeasonYear = SeasonUtility.GetCurrentSeasonYear(DateTime.Now);
        
        return new AnimeBrowseSectionRequest
        {
            Season = currentSeason,
            SeasonYear = currentSeasonYear,
            NextSeason = SeasonUtility.GetNextSeason(currentSeason),
            NextSeasonYear = SeasonUtility.GetNextSeasonYear(currentSeason, currentSeasonYear),
            LastSeason = SeasonUtility.GetLastSeason(currentSeason),
            LastSeasonYear = SeasonUtility.GetLastSeasonYear(currentSeason, currentSeasonYear)
        };
    }
}
