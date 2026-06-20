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

    public async Task<Anime> GetAnimeById(int id)
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

    public async Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest)
    {
        return await _animeProvider.GetAnime(animeFilterRequest);
    }

    public async Task<AnimeUserLibraryResponse> GetUserAnimeLibrary(int userId)
    {
       var library = await _animeProvider.GetUserAnimeLibrary(userId);
       return library with
       {
           Lists = library.Lists
                .Select(list => list with
                {
                    Entries = list.Entries
                        .OrderBy(entry => entry.Anime.Title.English ?? entry.Anime.Title.Romaji)
                        .ToList()
                })
                .ToList()
       };
    }

    public async Task<AnimeEntryUpsertResponse> UpsertAnimeEntry(AnimeEntryUpsertRequest animeEntryUpsertRequest)
    {
        return await _animeProvider.UpsertAnimeEntry(animeEntryUpsertRequest);
    }

    public async Task<ToggleFavouriteResponse> ToggleFavourite(int animeId)
    {
        return await _animeProvider.ToggleFavourite(animeId);
    }

    public async Task<DeleteAnimeEntryResponse> DeleteAnimeEntry(int animeEntryId)
    {
        return await _animeProvider.DeleteAnimeEntry(animeEntryId);
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
