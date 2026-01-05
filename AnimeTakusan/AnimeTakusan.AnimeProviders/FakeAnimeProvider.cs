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
        var animeResponse = _faker.Generate();
        animeResponse.Id = id;
        return Task.FromResult(animeResponse);
    }

    public Task<List<AnimeResponse>> GetSeasonalAnime(AnimeSeasonalRequest animeSeasonalRequest)
    {
        throw new NotImplementedException();
    }
}
