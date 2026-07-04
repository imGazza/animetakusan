using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AnimeTakusan.Application.Caching;

public class CacheAnimeProviderDecorator : IAnimeProvider
{
    private readonly IAnimeProvider _innerAnimeProvider;
    private readonly ICacheService _cache;
    private readonly CacheOptions _cacheOptions;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<CacheAnimeProviderDecorator> _logger;

    public CacheAnimeProviderDecorator(
        IAnimeProvider innerAnimeProvider, 
        ICacheService animeCache,
        IOptions<CacheOptions> cacheOptions,
        ICurrentUser currentUser,
        ILogger<CacheAnimeProviderDecorator> logger)
    {
        _innerAnimeProvider = innerAnimeProvider;
        _cache = animeCache;
        _cacheOptions = cacheOptions.Value;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<ViewerInfoResponse> GetViewerInfo()
    {
        int aniListUserId = _currentUser.AniListUserId ?? throw new InvalidOperationException("AniList user ID is not available.");
        
        return await _cache.GetOrSetAsync(
            CacheKeys.AniListUserInfo(aniListUserId),
            _cacheOptions.AniListUserTtl,
            () => _innerAnimeProvider.GetViewerInfo());
    }

    public async Task<AnimeDetailResponse> GetAnimeById(int id)
    {
        var publicAnime = await _cache.GetOrSetAsync(
            CacheKeys.AniListAnimeById(id),
            _cacheOptions.AniListPublicDataTtl,
            () => _innerAnimeProvider.GetAnimeById(id));

        if(_currentUser.AniListUserId is not int aniListUserId)
        {
            return publicAnime;
        }

        var libraryIndex = await GetUserLibraryIndex(aniListUserId);

        return (AnimeDetailResponse)ApplyUserOverlay(publicAnime, libraryIndex);
    }

    public async Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBrowseSectionRequest animeBrowseSectionRequest)
    {
        var publicBrowse = await _cache.GetOrSetAsync(
            CacheKeys.AniListBrowseSection(animeBrowseSectionRequest.Season, animeBrowseSectionRequest.SeasonYear),
            _cacheOptions.AniListPublicDataTtl,
            () => _innerAnimeProvider.GetAnimeBrowseSection(animeBrowseSectionRequest));

        if (_currentUser.AniListUserId is not int aniListUserId)
        {
            return publicBrowse;
        }

        var libraryIndex = await GetUserLibraryIndex(aniListUserId);

        return publicBrowse with
        {
            Season = OverlayPage(publicBrowse.Season, libraryIndex),
            NextSeason = OverlayPage(publicBrowse.NextSeason, libraryIndex),
            TopLastSeason = OverlayPage(publicBrowse.TopLastSeason, libraryIndex),
            Top = OverlayPage(publicBrowse.Top, libraryIndex),
        };
    }

    public async Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest)
    {
        if(!string.IsNullOrEmpty(animeFilterRequest.Filter?.Search))
        {
            return await _innerAnimeProvider.GetAnime(animeFilterRequest);
        }

        var publicFiltered = await _cache.GetOrSetAsync(
            CacheKeys.AniListFilteredAnime(animeFilterRequest),
            _cacheOptions.AniListPublicDataTtl,
            () => _innerAnimeProvider.GetAnime(animeFilterRequest));

        if(_currentUser.AniListUserId is not int aniListUserId)
        {
            return publicFiltered;
        }

        var libraryIndex = await GetUserLibraryIndex(aniListUserId);

        return OverlayPage(publicFiltered, libraryIndex);
    }

    public async Task<AnimeUserLibraryResponse> GetUserAnimeLibrary(int aniListUserId)
    {
        return await _cache.GetOrSetAsync(
            CacheKeys.AniListLibrary(aniListUserId),
            _cacheOptions.AniListLibraryTtl,
            () => _innerAnimeProvider.GetUserAnimeLibrary(aniListUserId));
    }

    public async Task<AnimeEntryUpsertResponse> UpsertAnimeEntry(AnimeEntryUpsertRequest upsertRequest)
    {
        if(_currentUser.AniListUserId is not int aniListUserId)
        {
            throw new InvalidOperationException("AniList user ID is not available.");
        }

        var response = await _innerAnimeProvider.UpsertAnimeEntry(upsertRequest);
        await _cache.RemoveAsync(CacheKeys.AniListLibrary(aniListUserId));
        return response;
    }

    public async Task<ToggleFavouriteResponse> ToggleFavourite(int animeId)
    {
        if(_currentUser.AniListUserId is not int aniListUserId)
        {
            throw new InvalidOperationException("AniList user ID is not available.");
        }

        var response = await _innerAnimeProvider.ToggleFavourite(animeId);
        await _cache.RemoveAsync(CacheKeys.AniListLibrary(aniListUserId));
        return response;
    }

    public async Task<DeleteAnimeEntryResponse> DeleteAnimeEntry(int animeEntryId)
    {
        if(_currentUser.AniListUserId is not int aniListUserId)
        {
            throw new InvalidOperationException("AniList user ID is not available.");
        }

        var response = await _innerAnimeProvider.DeleteAnimeEntry(animeEntryId);
        await _cache.RemoveAsync(CacheKeys.AniListLibrary(aniListUserId));
        return response;
    }

    

    private async Task<IReadOnlyDictionary<int, Anime>> GetUserLibraryIndex(int aniListUserId)
    {
        var userLibrary = await _cache.GetOrSetAsync(
            CacheKeys.AniListLibrary(aniListUserId),
            _cacheOptions.AniListLibraryTtl,
            () => _innerAnimeProvider.GetUserAnimeLibrary(aniListUserId));

        return userLibrary.Lists
            .SelectMany(list => list.Entries)
            .Select(entry => entry.Anime)
            .GroupBy(anime => anime.Id)
            .ToDictionary(group => group.Key, group => group.First());
    }
    
    private static Anime ApplyUserOverlay(Anime publicAnime, IReadOnlyDictionary<int, Anime> libraryIndex)
    {
        if (!libraryIndex.TryGetValue(publicAnime.Id, out var libraryAnime))
            return publicAnime;

        return publicAnime with
        {
            IsFavourite = libraryAnime.IsFavourite,
            MediaListEntry = libraryAnime.MediaListEntry
        };
    }

    private static AnimePageResponse OverlayPage(AnimePageResponse page, IReadOnlyDictionary<int, Anime> libraryIndex)
    {
        if (page?.Data is null)
            return page;

        return page with
        {
            Data = page.Data.Select(anime => ApplyUserOverlay(anime, libraryIndex)).ToList()
        };
    }
}
