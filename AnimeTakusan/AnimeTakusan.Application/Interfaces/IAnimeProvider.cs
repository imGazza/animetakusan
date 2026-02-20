using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAnimeProvider
{
    Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest);
    Task<AnimeResponse> GetAnimeById(int id);
    Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBrowseSectionRequest animeBroseSectionRequest);
}
