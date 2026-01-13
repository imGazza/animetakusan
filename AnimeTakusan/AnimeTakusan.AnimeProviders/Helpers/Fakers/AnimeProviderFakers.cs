using AnimeTakusan.AnimeProviders.AniListSchema;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using Bogus;

namespace AnimeTakusan.AnimeProviders.Helpers.Fakers;

public static class AnimeProviderFakers
{
    public static Faker<AnimeResponse> AnimeResponseFaker => new Faker<AnimeResponse>()
        .RuleFor(a => a.Id, f => f.Random.Number(1, 10000))
        .RuleFor(a => a.Title, f => TitleFaker.Generate());

    public static Faker<Title> TitleFaker => new Faker<Title>()
        .RuleFor(t => t.Romaji, f => f.Lorem.Sentence(3, 3))
        .RuleFor(t => t.English, f => f.Lorem.Sentence(3, 3))
        .RuleFor(t => t.Native, f => new Faker("ja").Lorem.Sentence(3, 3));

    // public static Faker<IGetAnimeByIdResult> AniListAnimeFaker => new Faker<AniListAnimeResponse>()
    //     .RuleFor(a => a.Id, f => f.Random.Number(1, 10000))
    //     .RuleFor(a => a.Title, f => AniListTitleFaker.Generate());

    // public static Faker<AniListTitle> AniListTitleFaker => new Faker<AniListTitle>()
    //     .RuleFor(t => t.Romaji, f => f.Lorem.Sentence(3, 3))
    //     .RuleFor(t => t.English, f => f.Lorem.Sentence(3, 3))
    //     .RuleFor(t => t.Native, f => new Faker("ja").Lorem.Sentence(3, 3));
}
