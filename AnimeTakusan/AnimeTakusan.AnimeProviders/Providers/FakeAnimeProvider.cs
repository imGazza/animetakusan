using AnimeTakusan.AnimeProviders.Helpers.Fakers;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using Bogus;

namespace AnimeTakusan.AnimeProviders;

public class FakeAnimeProvider : IAnimeProvider
{
    private readonly Faker<AnimeResponse> _faker;

    public FakeAnimeProvider()
    {
        _faker = AnimeProviderFakers.AnimeResponseFaker;
    }

    public Task<AnimeResponse> GetAnimeById(int id)
    {
        var animeResponse = _faker.RuleFor(a => a.Id, _ => id).Generate();
        return Task.FromResult(animeResponse);
    }

    public Task<AnimePageResponse> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        throw new NotImplementedException();
    }    

    public Task<AnimeBrowseResponse> GetAnimeBrowseSection(AnimeBroseSectionRequest animeBroseSectionRequest)
    {
        throw new NotImplementedException();
    }
}
