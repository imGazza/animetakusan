using AnimeTakusan.AnimeProviders.AniList.Helpers.Fakers;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using Bogus;

namespace AnimeTakusan.AnimeProviders.AniList.Providers;

public class FakeAnimeProvider : IAnimeProvider
{
    private readonly Faker<Anime> _faker;

    public FakeAnimeProvider()
    {
        _faker = AnimeProviderFakers.AnimeResponseFaker;
    }

    public Task<AnimeDetailResponse> GetAnimeById(int id)
    {
        var animeResponse = (AnimeDetailResponse)_faker.RuleFor(a => a.Id, _ => id).Generate();
        return Task.FromResult(animeResponse);
    }

    public Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        throw new NotImplementedException();
    }    

    public Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBrowseSectionRequest animeBroseSectionRequest)
    {
        throw new NotImplementedException();
    }

    public Task<AnimePageResponse> GetAnime(AnimeFilterRequest animeFilterRequest)
    {
        throw new NotImplementedException();
    }

    public Task<AnimeUserListResponse> GetUserAnimeList(int aniListUserId)
    {
        throw new NotImplementedException();
    }
}
