using AnimeTakusan.AnimeProviders.AniListSchema;
using Bogus;
using FluentAssertions.Equivalency;

namespace AnimeTakusan.Tests.TestHelpers.Fakers;

public static class AniListProviderFakers
{
    // Use the concrete implementation class instead of the interface
    public static Faker<GetAnimeById_Media_Media> AniListAnimeFaker => new Faker<GetAnimeById_Media_Media>()
        .CustomInstantiator(f => new GetAnimeById_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            isFavourite: f.Random.Bool(),
            mediaListEntry: null,
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate(),
            relations: AniListRelationsFaker.Generate()
        ));

    public static Faker<GetSeasonalAnime_Page_Media_Media> AniListSeasonalAnimeFaker => new Faker<GetSeasonalAnime_Page_Media_Media>()
        .CustomInstantiator(f => new GetSeasonalAnime_Page_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            isFavourite: f.Random.Bool(),
            mediaListEntry: null,
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

    public static Faker<GetBrowseSection_Season_Media_Media> AniListBrowseSeasonAnimeFaker => new Faker<GetBrowseSection_Season_Media_Media>()
        .CustomInstantiator(f => new GetBrowseSection_Season_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            isFavourite: f.Random.Bool(),
            mediaListEntry: null,
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

    public static Faker<GetBrowseSection_NextSeason_Media_Media> AniListBrowseNextSeasonAnimeFaker => new Faker<GetBrowseSection_NextSeason_Media_Media>()
        .CustomInstantiator(f => new GetBrowseSection_NextSeason_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            isFavourite: f.Random.Bool(),
            mediaListEntry: null,
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

    public static Faker<GetBrowseSection_TopLastSeason_Media_Media> AniListBrowseTopLastSeasonAnimeFaker => new Faker<GetBrowseSection_TopLastSeason_Media_Media>()
        .CustomInstantiator(f => new GetBrowseSection_TopLastSeason_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            isFavourite: f.Random.Bool(),
            mediaListEntry: null,
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

    public static Faker<GetBrowseSection_Top_Media_Media> AniListBrowseTopAnimeFaker => new Faker<GetBrowseSection_Top_Media_Media>()
        .CustomInstantiator(f => new GetBrowseSection_Top_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            isFavourite: f.Random.Bool(),
            mediaListEntry: null,
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

    public static Faker<GetAnimeById_Media_Title_MediaTitle> AniListTitleFaker => new Faker<GetAnimeById_Media_Title_MediaTitle>()
        .CustomInstantiator(f => new GetAnimeById_Media_Title_MediaTitle(
            english: f.Lorem.Sentence(3, 3),
            romaji: f.Lorem.Sentence(3, 3),
            native: new Faker("ja").Lorem.Sentence(3, 3)
        ));

    public static Faker<GetAnimeById_Media_CoverImage_MediaCoverImage> AniListCoverImageFaker => new Faker<GetAnimeById_Media_CoverImage_MediaCoverImage>()
        .CustomInstantiator(f => new GetAnimeById_Media_CoverImage_MediaCoverImage(
            extraLarge: f.Image.PlaceholderUrl(460, 650),
            color: f.Random.String2(7, "0123456789ABCDEF")
        ));

    public static Faker<GetAnimeById_Media_Studios_StudioConnection> AniListStudiosFaker => new Faker<GetAnimeById_Media_Studios_StudioConnection>()
        .CustomInstantiator(f => new GetAnimeById_Media_Studios_StudioConnection(
            nodes: AniListStudiosNodesFaker.GenerateBetween(1, 3).ToArray()
        ));

    public static Faker<GetAnimeById_Media_Studios_Nodes_Studio> AniListStudiosNodesFaker => new Faker<GetAnimeById_Media_Studios_Nodes_Studio>()
        .CustomInstantiator(f => new GetAnimeById_Media_Studios_Nodes_Studio(
            id: f.Random.Number(1, 10000),
            name: f.Company.CompanyName()
        ));

    public static Faker<GetAnimeById_Media_Relations_MediaConnection> AniListRelationsFaker => new Faker<GetAnimeById_Media_Relations_MediaConnection>()
        .CustomInstantiator(f => new GetAnimeById_Media_Relations_MediaConnection(
            edges: AniListRelationEdgeFaker.GenerateBetween(0, 3).ToArray()
        ));

    public static Faker<GetAnimeById_Media_Relations_Edges_MediaEdge> AniListRelationEdgeFaker => new Faker<GetAnimeById_Media_Relations_Edges_MediaEdge>()
        .CustomInstantiator(f => new GetAnimeById_Media_Relations_Edges_MediaEdge(
            relationType: f.PickRandom<MediaRelation>(),
            node: AniListRelationNodeFaker.Generate()
        ));

    public static Faker<GetAnimeById_Media_Relations_Edges_Node_Media> AniListRelationNodeFaker => new Faker<GetAnimeById_Media_Relations_Edges_Node_Media>()
        .CustomInstantiator(f => new GetAnimeById_Media_Relations_Edges_Node_Media(
            id: f.Random.Number(1, 10000),
            coverImage: AniListRelationNodeCoverImageFaker.Generate(),
            title: AniListRelationNodeTitleFaker.Generate()
        ));

    public static Faker<GetAnimeById_Media_Relations_Edges_Node_CoverImage_MediaCoverImage> AniListRelationNodeCoverImageFaker => new Faker<GetAnimeById_Media_Relations_Edges_Node_CoverImage_MediaCoverImage>()
        .CustomInstantiator(f => new GetAnimeById_Media_Relations_Edges_Node_CoverImage_MediaCoverImage(
            extraLarge: f.Image.PlaceholderUrl(460, 650),
            color: f.Random.String2(7, "0123456789ABCDEF")
        ));

    public static Faker<GetAnimeById_Media_Relations_Edges_Node_Title_MediaTitle> AniListRelationNodeTitleFaker => new Faker<GetAnimeById_Media_Relations_Edges_Node_Title_MediaTitle>()
        .CustomInstantiator(f => new GetAnimeById_Media_Relations_Edges_Node_Title_MediaTitle(
            english: f.Lorem.Sentence(3, 3),
            native: new Faker("ja").Lorem.Sentence(3, 3),
            romaji: f.Lorem.Sentence(3, 3)
        ));

    public static Faker<GetAnime_Page_Media_Media> AniListGetAnimeAnimeFaker => new Faker<GetAnime_Page_Media_Media>()
        .CustomInstantiator(f => new GetAnime_Page_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            isFavourite: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            mediaListEntry: null,
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

    public static Faker<GetUserAnimeList_MediaListCollection_Lists_Entries_Media_Media> AniListUserAnimeListMediaFaker => new Faker<GetUserAnimeList_MediaListCollection_Lists_Entries_Media_Media>()
        .CustomInstantiator(f => new GetUserAnimeList_MediaListCollection_Lists_Entries_Media_Media(
            id: f.Random.Number(1, 10000),
            title: AniListTitleFaker.Generate(),
            coverImage: AniListCoverImageFaker.Generate(),
            startDate: null,
            endDate: null,
            bannerImage: f.Image.PlaceholderUrl(1900, 400),
            season: f.PickRandom<MediaSeason>(),
            seasonYear: f.Random.Number(2000, 2026),
            description: f.Lorem.Paragraphs(1, 3),
            type: f.PickRandom<MediaType>(),
            format: f.PickRandom<MediaFormat>(),
            status: f.PickRandom<MediaStatus>(),
            episodes: f.Random.Number(1, 50),
            duration: f.Random.Number(0, 100),
            genres: f.Random.WordsArray(3, 7),
            isAdult: f.Random.Bool(),
            isFavourite: f.Random.Bool(),
            averageScore: f.Random.Number(0, 100),
            mediaListEntry: null,
            nextAiringEpisode: null,
            studios: AniListStudiosFaker.Generate()
        ));

}
