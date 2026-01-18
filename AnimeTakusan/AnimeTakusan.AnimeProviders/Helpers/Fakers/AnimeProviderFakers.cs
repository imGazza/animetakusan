using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using Bogus;

namespace AnimeTakusan.AnimeProviders.Helpers.Fakers;

public static class AnimeProviderFakers
{
    public static Faker<AnimeResponse> AnimeResponseFaker => new Faker<AnimeResponse>()
        .RuleFor(a => a.Id, f => f.Random.Number(1, 10000))
        .RuleFor(a => a.Title, f => TitleFaker.Generate())
        .RuleFor(a => a.CoverImage, f => CoverImageFaker.Generate())
        .RuleFor(a => a.StartDate, f => DetailedDateFaker.Generate())
        .RuleFor(a => a.EndDate, f => DetailedDateFaker.Generate())
        .RuleFor(a => a.BannerImage, f => f.Image.PlaceholderUrl(1900, 400))
        .RuleFor(a => a.Season, f => f.PickRandom<AnimeSeason>())
        .RuleFor(a => a.SeasonYear, f => f.Random.Number(2000, 2026))
        .RuleFor(a => a.Description, f => f.Lorem.Paragraphs(1, 3))
        .RuleFor(a => a.Type, f => f.PickRandom<AnimeType>())
        .RuleFor(a => a.Format, f => f.PickRandom<AnimeFormat>())
        .RuleFor(a => a.Status, f => f.PickRandom<AnimeStatus>())
        .RuleFor(a => a.Episodes, f => f.Random.Number(1, 50))
        .RuleFor(a => a.Duration, f => f.Random.Number(20, 100))
        .RuleFor(a => a.Genres, f => f.Random.WordsArray(3, 7).ToList())
        .RuleFor(a => a.IsAdult, f => f.Random.Bool())
        .RuleFor(a => a.AverageScore, f => f.Random.Number(0, 100))
        .RuleFor(a => a.NextAiringEpisode, f => AiringScheduleFaker.Generate())
        .RuleFor(a => a.Studios, f => StudioConnectionFaker.Generate());

    public static Faker<Title> TitleFaker => new Faker<Title>()
        .RuleFor(t => t.Romaji, f => f.Lorem.Sentence(3, 3))
        .RuleFor(t => t.English, f => f.Lorem.Sentence(3, 3))
        .RuleFor(t => t.Native, f => new Faker("ja").Lorem.Sentence(3, 3));

    public static Faker<CoverImage> CoverImageFaker => new Faker<CoverImage>()
        .RuleFor(c => c.ExtraLarge, f => f.Image.PlaceholderUrl(460, 650))
        .RuleFor(c => c.Large, f => f.Image.PlaceholderUrl(230, 325))
        .RuleFor(c => c.Color, f => $"#{f.Random.String2(6, "0123456789ABCDEF")}");

    public static Faker<DetailedDate> DetailedDateFaker => new Faker<DetailedDate>()
        .RuleFor(d => d.Year, f => f.Random.Number(2000, 2026))
        .RuleFor(d => d.Month, f => f.Random.Number(1, 12))
        .RuleFor(d => d.Day, f => f.Random.Number(1, 28));

    public static Faker<AiringSchedule> AiringScheduleFaker => new Faker<AiringSchedule>()
        .RuleFor(a => a.AiringAt, f => f.Date.Future().Ticks)
        .RuleFor(a => a.TimeUntilAiring, f => f.Random.Number(0, 604800))
        .RuleFor(a => a.Episode, f => f.Random.Number(1, 50));

    public static Faker<StudioConnection> StudioConnectionFaker => new Faker<StudioConnection>()
        .RuleFor(s => s.Nodes, f => StudioFaker.GenerateBetween(1, 3).ToList());

    public static Faker<Studio> StudioFaker => new Faker<Studio>()
        .RuleFor(s => s.Id, f => f.Random.Number(1, 10000))
        .RuleFor(s => s.Name, f => f.Company.CompanyName());
}
