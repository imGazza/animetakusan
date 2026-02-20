using AnimeTakusan.AnimeProviders;
using AnimeTakusan.AnimeProviders.AniListSchema;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Domain.Exceptions.GraphQLExceptions;
using AnimeTakusan.Tests.TestHelpers;
using AnimeTakusan.Tests.TestHelpers.Fakers;
using Bogus;
using FluentAssertions;
using Moq;
using StrawberryShake;

namespace AnimeTakusan.Tests.Unit.AnimeProviders;

/// <summary>
/// Unit tests for AniListProvider.
/// Partially generated using AI assistance.
/// </summary>
public class AniListProviderTest
{
    private readonly Mock<IAniListClient> _mockAniListClient;
    private readonly Mock<IGetAnimeByIdQuery> _mockGetAnimeByIdQuery;
    private readonly Mock<IGetSeasonalAnimeQuery> _mockGetSeasonalAnimeQuery;
    private readonly Mock<IGetBrowseSectionQuery> _mockGetAnimeBrowseSectionQuery;
    private readonly AniListProvider _aniListProvider;
    private readonly Faker<GetAnimeById_Media_Media> _animeFaker;
    private readonly Faker<GetSeasonalAnime_Page_Media_Media> _pageSeasonalAnimeFaker;
    private readonly Faker<GetBrowseSection_Season_Media_Media> _pageBrowseSeasonAnimeFaker;
    private readonly Faker<GetBrowseSection_Top_Media_Media> _pageBrowseTopAnimeFaker;
    private readonly Faker<GetBrowseSection_NextSeason_Media_Media> _pageBrowseNextSeasonAnimeFaker;
    private readonly Faker<GetBrowseSection_TopLastSeason_Media_Media> _pageTopLastSeasonAnimeFaker;


    private const string ProviderName = "AniList";

    public AniListProviderTest()
    {
        // Configure Mapster mappings before running tests
        MapsterTestConfiguration.ConfigureMapster();
        
        _mockAniListClient = new Mock<IAniListClient>();
        _mockGetAnimeByIdQuery = new Mock<IGetAnimeByIdQuery>();
        _mockGetSeasonalAnimeQuery = new Mock<IGetSeasonalAnimeQuery>();
        _mockGetAnimeBrowseSectionQuery = new Mock<IGetBrowseSectionQuery>();
        _mockAniListClient.Setup(x => x.GetAnimeById).Returns(_mockGetAnimeByIdQuery.Object);
        _mockAniListClient.Setup(x => x.GetSeasonalAnime).Returns(_mockGetSeasonalAnimeQuery.Object);
        _mockAniListClient.Setup(x => x.GetBrowseSection).Returns(_mockGetAnimeBrowseSectionQuery.Object);
        
        _aniListProvider = new AniListProvider(_mockAniListClient.Object);
        _animeFaker = AniListProviderFakers.AniListAnimeFaker;
        _pageSeasonalAnimeFaker = AniListProviderFakers.AniListSeasonalAnimeFaker;
        _pageBrowseSeasonAnimeFaker = AniListProviderFakers.AniListBrowseSeasonAnimeFaker;
        _pageBrowseTopAnimeFaker = AniListProviderFakers.AniListBrowseTopAnimeFaker;
        _pageBrowseNextSeasonAnimeFaker = AniListProviderFakers.AniListBrowseNextSeasonAnimeFaker;
        _pageTopLastSeasonAnimeFaker = AniListProviderFakers.AniListBrowseTopLastSeasonAnimeFaker;
    }

    #region GetAnimeById Tests

    [Fact(DisplayName = "GetAnimeById should execute query with correct ID")]
    public async Task GetAnimeById_ValidId_ExecutesQueryWithCorrectId()
    {
        // Arrange
        var animeId = 42;
        var mockResult = CreateMockOperationResult<IGetAnimeByIdResult>(
            new Mock<IGetAnimeByIdResult>().Object);
        
        _mockGetAnimeByIdQuery
            .Setup(x => x.ExecuteAsync(animeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeById(animeId);

        // Assert
        _mockGetAnimeByIdQuery.Verify(
            x => x.ExecuteAsync(animeId, It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetAnimeById should return mapped AnimeResponse")]
    public async Task GetAnimeById_ValidResponse_ReturnsMappedAnimeResponse()
    {
        // Arrange
        var mockMedia = _animeFaker.Generate();
        var mockResultData = CreateMockGetAnimeByIdResult(mockMedia);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetAnimeByIdQuery
            .Setup(x => x.ExecuteAsync(mockMedia.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        var result = await _aniListProvider.GetAnimeById(mockMedia.Id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(mockMedia.Id);
    }

    [Fact(DisplayName = "GetAnimeById should throw GraphQLQueryFailedException on errors")]
    public async Task GetAnimeById_GraphQLErrors_ThrowsGraphQLQueryFailedException()
    {
        // Arrange
        var animeId = 1;
        var errors = new List<IClientError>
        {
            CreateMockClientError("Not found"),
            CreateMockClientError("Invalid ID")
        };
        var mockResult = CreateMockOperationResultWithErrors<IGetAnimeByIdResult>(errors);
        
        _mockGetAnimeByIdQuery
            .Setup(x => x.ExecuteAsync(animeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act & Assert
        var act = async () => await _aniListProvider.GetAnimeById(animeId);
        await act.Should().ThrowAsync<GraphQLQueryFailedException>()
            .WithMessage($"{ProviderName} query failed: Not found, Invalid ID");
    }

    #endregion

    #region GetSeasonalAnime Tests

    [Fact(DisplayName = "GetSeasonalAnime should execute query with correct parameters")]
    public async Task GetSeasonalAnime_ValidRequest_ExecutesQueryWithCorrectParameters()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            Page = 1,
            PerPage = 10,
            Sort = "POPULARITY_DESC"
        };
        
        var mockPage = CreateMockPage(new List<GetSeasonalAnime_Page_Media_Media>());
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                1,
                10,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        _mockGetSeasonalAnimeQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                1,
                10,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetSeasonalAnime should return mapped list of AnimeResponses")]
    public async Task GetSeasonalAnime_ValidResponse_ReturnsMappedAnimeList()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SUMMER",
            SeasonYear = 2023,
            Page = 1,
            PerPage = 5,
            Sort = "POPULARITY_DESC"
        };
        
        var mockMediaList = _pageSeasonalAnimeFaker.Generate(3);
        
        var mockPage = CreateMockPage(mockMediaList, 1, 5, false);
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<IReadOnlyList<MediaSort?>>(),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        var result = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().HaveCount(3);
        result.Page.Should().NotBeNull();
        result.Page.CurrentPage.Should().Be(1);
        result.Page.PerPage.Should().Be(5);
        result.Page.HasNextPage.Should().BeFalse();
        
        result.Data[0].Id.Should().Be(mockMediaList[0].Id);
        result.Data[0].Title.Romaji.Should().Be(mockMediaList[0].Title.Romaji);
        result.Data[1].Id.Should().Be(mockMediaList[1].Id);
        result.Data[2].Id.Should().Be(mockMediaList[2].Id);
    }

    [Fact(DisplayName = "GetSeasonalAnime should handle empty result list")]
    public async Task GetSeasonalAnime_EmptyResult_ReturnsEmptyList()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "FALL",
            SeasonYear = 1990,
            Page = 1,
            PerPage = 10,
            Sort = "POPULARITY_DESC"
        };
        
        var mockPage = CreateMockPage(new List<GetSeasonalAnime_Page_Media_Media>(), 1, 10, false);
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<IReadOnlyList<MediaSort?>>(),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        var result = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().BeEmpty();
        result.Page.HasNextPage.Should().BeFalse();
    }

    [Fact(DisplayName = "GetSeasonalAnime should handle pagination correctly")]
    public async Task GetSeasonalAnime_PaginatedRequest_ReturnsCorrectPageInfo()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            Page = 3,
            PerPage = 15,
            Sort = "POPULARITY_DESC"
        };
        
        var mockMediaList = _pageSeasonalAnimeFaker.Generate(15);
        
        var mockPage = CreateMockPage(mockMediaList, 3, 15, true);
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<IReadOnlyList<MediaSort?>>(),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        var result = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().HaveCount(15);
        result.Page.CurrentPage.Should().Be(3);
        result.Page.PerPage.Should().Be(15);
        result.Page.HasNextPage.Should().BeTrue();
    }

    [Fact(DisplayName = "GetSeasonalAnime should throw GraphQLQueryFailedException on errors")]
    public async Task GetSeasonalAnime_GraphQLErrors_ThrowsGraphQLQueryFailedException()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            Page = 1,
            PerPage = 10,
            Sort = "POPULARITY_DESC"
        };
        
        var errors = new List<IClientError>
        {
            CreateMockClientError("Service unavailable")
        };
        var mockResult = CreateMockOperationResultWithErrors<IGetSeasonalAnimeResult>(errors);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<IReadOnlyList<MediaSort?>>(),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act & Assert
        var act = async () => await _aniListProvider.GetSeasonalAnime(seasonalRequest);
        await act.Should().ThrowAsync<GraphQLQueryFailedException>()
            .WithMessage($"{ProviderName} query failed: Service unavailable");
    }

    [Theory(DisplayName = "GetSeasonalAnime should handle different seasons correctly")]
    [InlineData("WINTER", MediaSeason.Winter)]
    [InlineData("SPRING", MediaSeason.Spring)]
    [InlineData("SUMMER", MediaSeason.Summer)]
    [InlineData("FALL", MediaSeason.Fall)]
    public async Task GetSeasonalAnime_DifferentSeasons_ProcessesCorrectly(string season, MediaSeason expectedSeason)
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = season,
            SeasonYear = 2023,
            Page = 1,
            PerPage = 10,
            Sort = "POPULARITY_DESC"
        };
        
        var mockPage = CreateMockPage(new List<GetSeasonalAnime_Page_Media_Media>());
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                expectedSeason,
                It.IsAny<int?>(),
                It.IsAny<IReadOnlyList<MediaSort?>>(),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        _mockGetSeasonalAnimeQuery.Verify(
            x => x.ExecuteAsync(
                expectedSeason,
                2023,
                It.IsAny<IReadOnlyList<MediaSort?>>(),
                1,
                10,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetSeasonalAnime should use default sort when sort is null")]
    public async Task GetSeasonalAnime_NullSort_UsesDefaultSort()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            Page = 1,
            PerPage = 10,
            Sort = null
        };
        
        var mockPage = CreateMockPage(new List<GetSeasonalAnime_Page_Media_Media>());
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        _mockGetSeasonalAnimeQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                1,
                10,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Theory(DisplayName = "GetSeasonalAnime should parse sort case-insensitively")]
    [InlineData("popularity_desc")]
    [InlineData("POPULARITY_DESC")]
    [InlineData("Popularity_Desc")]
    public async Task GetSeasonalAnime_CaseInsensitiveSort_ParsesCorrectly(string sortValue)
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            Page = 1,
            PerPage = 10,
            Sort = sortValue
        };
        
        var mockPage = CreateMockPage(new List<GetSeasonalAnime_Page_Media_Media>());
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        _mockGetSeasonalAnimeQuery.Verify(
            x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetSeasonalAnime should use default for invalid sort")]
    public async Task GetSeasonalAnime_InvalidSort_UsesDefault()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            Page = 1,
            PerPage = 10,
            Sort = "INVALID_SORT_VALUE"
        };
        
        var mockPage = CreateMockPage(new List<GetSeasonalAnime_Page_Media_Media>());
        var mockResultData = CreateMockGetSeasonalAnimeResult(mockPage);
        var mockResult = CreateMockOperationResult(mockResultData);
        
        _mockGetSeasonalAnimeQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                It.IsAny<int?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        _mockGetSeasonalAnimeQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                It.Is<IReadOnlyList<MediaSort?>>(list => list.Count == 1 && list[0] == MediaSort.PopularityDesc),
                1,
                10,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    #endregion

    #region GetAnimeBrowseSection Tests

    [Fact(DisplayName = "GetAnimeBrowseSection should execute query with correct parameters")]
    public async Task GetAnimeBrowseSection_ValidRequest_ExecutesQueryWithCorrectParameters()
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            NextSeason = "SUMMER",
            NextSeasonYear = 2023,
            LastSeason = "WINTER",
            LastSeasonYear = 2023
        };

        var mockData = CreateMockGetBrowseSectionResult(
            new Mock<IGetBrowseSection_Season>().Object,
            new Mock<IGetBrowseSection_NextSeason>().Object,
            new Mock<IGetBrowseSection_TopLastSeason>().Object,
            new Mock<IGetBrowseSection_Top>().Object);

        var mockResult = CreateMockOperationResult(mockData);

        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                MediaSeason.Summer,
                2023,
                MediaSeason.Winter,
                2023,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        _mockGetAnimeBrowseSectionQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                MediaSeason.Summer,
                2023,
                MediaSeason.Winter,
                2023,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetAnimeBrowseSection should return mapped AnimeBrowseResponse")]
    public async Task GetAnimeBrowseSection_ValidResponse_ReturnsMappedAnimeBrowseResponse()
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            NextSeason = "SUMMER",
            NextSeasonYear = 2023,
            LastSeason = "WINTER",
            LastSeasonYear = 2023
        };

        var mockSeason = _pageBrowseSeasonAnimeFaker.Generate(3);
        var mockNextSeason = _pageBrowseNextSeasonAnimeFaker.Generate(3);
        var mockTopLastSeason = _pageTopLastSeasonAnimeFaker.Generate(3);
        var mockTop = _pageBrowseTopAnimeFaker.Generate(3);

        var mockData = CreateMockBrowseSectionPages(mockSeason, mockNextSeason, mockTopLastSeason, mockTop);
        var mockResult = CreateMockOperationResult(mockData);

        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                MediaSeason.Summer,
                2023,
                MediaSeason.Winter,
                2023,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        var result = await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        result.Should().NotBeNull();
        result.Season.Should().NotBeNull();
        result.NextSeason.Should().NotBeNull();
        result.TopLastSeason.Should().NotBeNull();
        result.Top.Should().NotBeNull();
        result.Season.Data.Should().HaveCount(3);
        result.NextSeason.Data.Should().HaveCount(3);
        result.TopLastSeason.Data.Should().HaveCount(3);
        result.Top.Data.Should().HaveCount(3);        
    }

    [Fact(DisplayName = "GetAnimeBrowseSection should throw GraphQLQueryFailedException on errors")]
    public async Task GetAnimeBrowseSection_GraphQLErrors_ThrowsGraphQLQueryFailedException()
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            NextSeason = "SUMMER",
            NextSeasonYear = 2023,
            LastSeason = "WINTER",
            LastSeasonYear = 2023
        };
        
        var errors = new List<IClientError>
        {
            CreateMockClientError("Service unavailable"),
            CreateMockClientError("Rate limit exceeded")
        };
        var mockResult = CreateMockOperationResultWithErrors<IGetBrowseSectionResult>(errors);
        
        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<MediaSeason?>(),
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act & Assert
        var act = async () => await _aniListProvider.GetAnimeBrowseSection(request);
        await act.Should().ThrowAsync<GraphQLQueryFailedException>()
            .WithMessage($"{ProviderName} query failed: Service unavailable, Rate limit exceeded");
    }

    [Theory(DisplayName = "GetAnimeBrowseSection should handle different seasons correctly")]
    [InlineData("WINTER", "SPRING", "FALL", MediaSeason.Winter, MediaSeason.Spring, MediaSeason.Fall)]
    [InlineData("SPRING", "SUMMER", "WINTER", MediaSeason.Spring, MediaSeason.Summer, MediaSeason.Winter)]
    [InlineData("SUMMER", "FALL", "SPRING", MediaSeason.Summer, MediaSeason.Fall, MediaSeason.Spring)]
    [InlineData("FALL", "WINTER", "SUMMER", MediaSeason.Fall, MediaSeason.Winter, MediaSeason.Summer)]
    public async Task GetAnimeBrowseSection_DifferentSeasons_ProcessesCorrectly(
        string season, string nextSeason, string lastSeason,
        MediaSeason expectedSeason, MediaSeason expectedNextSeason, MediaSeason expectedLastSeason)
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = season,
            SeasonYear = 2023,
            NextSeason = nextSeason,
            NextSeasonYear = 2023,
            LastSeason = lastSeason,
            LastSeasonYear = 2023
        };
        
        var mockData = CreateMockGetBrowseSectionResult(
            new Mock<IGetBrowseSection_Season>().Object,
            new Mock<IGetBrowseSection_NextSeason>().Object,
            new Mock<IGetBrowseSection_TopLastSeason>().Object,
            new Mock<IGetBrowseSection_Top>().Object);
        var mockResult = CreateMockOperationResult(mockData);
        
        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                expectedSeason,
                It.IsAny<int?>(),
                expectedNextSeason,
                It.IsAny<int?>(),
                expectedLastSeason,
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        _mockGetAnimeBrowseSectionQuery.Verify(
            x => x.ExecuteAsync(
                expectedSeason,
                2023,
                expectedNextSeason,
                2023,
                expectedLastSeason,
                2023,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetAnimeBrowseSection should use default season when season is invalid")]
    public async Task GetAnimeBrowseSection_InvalidSeasons_UsesDefaultSeasons()
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = "INVALID_SEASON",
            SeasonYear = 2023,
            NextSeason = "ALSO_INVALID",
            NextSeasonYear = 2023,
            LastSeason = "NOT_A_SEASON",
            LastSeasonYear = 2023
        };
        
        var mockData = CreateMockGetBrowseSectionResult(
            new Mock<IGetBrowseSection_Season>().Object,
            new Mock<IGetBrowseSection_NextSeason>().Object,
            new Mock<IGetBrowseSection_TopLastSeason>().Object,
            new Mock<IGetBrowseSection_Top>().Object);
        var mockResult = CreateMockOperationResult(mockData);
        
        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Winter,
                It.IsAny<int?>(),
                MediaSeason.Winter,
                It.IsAny<int?>(),
                MediaSeason.Winter,
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        _mockGetAnimeBrowseSectionQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Winter,
                2023,
                MediaSeason.Winter,
                2023,
                MediaSeason.Winter,
                2023,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetAnimeBrowseSection should handle null season values")]
    public async Task GetAnimeBrowseSection_NullSeasons_UsesDefaultSeasons()
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = null,
            SeasonYear = 2023,
            NextSeason = null,
            NextSeasonYear = 2023,
            LastSeason = null,
            LastSeasonYear = 2023
        };
        
        var mockData = CreateMockGetBrowseSectionResult(
            new Mock<IGetBrowseSection_Season>().Object,
            new Mock<IGetBrowseSection_NextSeason>().Object,
            new Mock<IGetBrowseSection_TopLastSeason>().Object,
            new Mock<IGetBrowseSection_Top>().Object);
        var mockResult = CreateMockOperationResult(mockData);
        
        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Winter,
                It.IsAny<int?>(),
                MediaSeason.Winter,
                It.IsAny<int?>(),
                MediaSeason.Winter,
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        _mockGetAnimeBrowseSectionQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Winter,
                2023,
                MediaSeason.Winter,
                2023,
                MediaSeason.Winter,
                2023,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Theory(DisplayName = "GetAnimeBrowseSection should parse seasons case-insensitively")]
    [InlineData("winter")]
    [InlineData("WINTER")]
    [InlineData("Winter")]
    public async Task GetAnimeBrowseSection_CaseInsensitiveSeasons_ParsesCorrectly(string seasonValue)
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = seasonValue,
            SeasonYear = 2023,
            NextSeason = seasonValue,
            NextSeasonYear = 2023,
            LastSeason = seasonValue,
            LastSeasonYear = 2023
        };
        
        var mockData = CreateMockGetBrowseSectionResult(
            new Mock<IGetBrowseSection_Season>().Object,
            new Mock<IGetBrowseSection_NextSeason>().Object,
            new Mock<IGetBrowseSection_TopLastSeason>().Object,
            new Mock<IGetBrowseSection_Top>().Object);
        var mockResult = CreateMockOperationResult(mockData);
        
        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Winter,
                It.IsAny<int?>(),
                MediaSeason.Winter,
                It.IsAny<int?>(),
                MediaSeason.Winter,
                It.IsAny<int?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        _mockGetAnimeBrowseSectionQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Winter,
                2023,
                MediaSeason.Winter,
                2023,
                MediaSeason.Winter,
                2023,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact(DisplayName = "GetAnimeBrowseSection should verify all season years are passed correctly")]
    public async Task GetAnimeBrowseSection_WithSeasonYears_PassesAllYearsCorrectly()
    {
        // Arrange
        var request = new AnimeBrowseSectionRequest
        {
            Season = "SPRING",
            SeasonYear = 2023,
            NextSeason = "SUMMER",
            NextSeasonYear = 2024,
            LastSeason = "WINTER",
            LastSeasonYear = 2022
        };
        
        var mockData = CreateMockGetBrowseSectionResult(
            new Mock<IGetBrowseSection_Season>().Object,
            new Mock<IGetBrowseSection_NextSeason>().Object,
            new Mock<IGetBrowseSection_TopLastSeason>().Object,
            new Mock<IGetBrowseSection_Top>().Object);
        var mockResult = CreateMockOperationResult(mockData);
        
        _mockGetAnimeBrowseSectionQuery
            .Setup(x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                MediaSeason.Summer,
                2024,
                MediaSeason.Winter,
                2022,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResult);

        // Act
        await _aniListProvider.GetAnimeBrowseSection(request);

        // Assert
        _mockGetAnimeBrowseSectionQuery.Verify(
            x => x.ExecuteAsync(
                MediaSeason.Spring,
                2023,
                MediaSeason.Summer,
                2024,
                MediaSeason.Winter,
                2022,
                It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    #endregion

    #region Helper Methods

    private static IOperationResult<T> CreateMockOperationResult<T>(T data) where T : class
    {
        var mockResult = new Mock<IOperationResult<T>>();
        mockResult.Setup(x => x.Data).Returns(data);
        mockResult.Setup(x => x.Errors).Returns(Array.Empty<IClientError>());
        return mockResult.Object;
    }

    private static IOperationResult<T> CreateMockOperationResultWithErrors<T>(List<IClientError> errors) where T : class
    {
        var mockResult = new Mock<IOperationResult<T>>();
        mockResult.Setup(x => x.Data).Returns((T)null);
        mockResult.Setup(x => x.Errors).Returns(errors);
        return mockResult.Object;
    }

    private static IClientError CreateMockClientError(string message)
    {
        var mockError = new Mock<IClientError>();
        mockError.Setup(x => x.Message).Returns(message);
        return mockError.Object;
    }

    private static IGetAnimeByIdResult CreateMockGetAnimeByIdResult(GetAnimeById_Media_Media media)
    {
        var mockResult = new Mock<IGetAnimeByIdResult>();
        mockResult.Setup(x => x.Media).Returns(media);
        return mockResult.Object;
    }

    private static GetSeasonalAnime_Page_Page CreateMockPage(List<GetSeasonalAnime_Page_Media_Media> mediaList, int currentPage = 1, int perPage = 20, bool hasNextPage = false)
    {
        var pageInfo = new GetSeasonalAnime_Page_PageInfo_PageInfo(
            currentPage: currentPage,
            hasNextPage: hasNextPage,
            perPage: perPage
        );

        return new GetSeasonalAnime_Page_Page(
            pageInfo: pageInfo,
            media: mediaList.Cast<IGetSeasonalAnime_Page_Media>().ToList()
        );
    }

    private static IGetSeasonalAnimeResult CreateMockGetSeasonalAnimeResult(IGetSeasonalAnime_Page page)
    {
        var mockResult = new Mock<IGetSeasonalAnimeResult>();
        mockResult.Setup(x => x.Page).Returns(page);
        return mockResult.Object;
    }

    private static IGetBrowseSectionResult CreateMockBrowseSectionPages(
        List<GetBrowseSection_Season_Media_Media> seasonMedia,
        List<GetBrowseSection_NextSeason_Media_Media> nextSeasonMedia,
        List<GetBrowseSection_TopLastSeason_Media_Media> topLastSeasonMedia,
        List<GetBrowseSection_Top_Media_Media> topMedia,
        int currentPage = 1,
        int perPage = 3,
        bool hasNextPage = false)
    {
        var pageInfoSeason = new GetBrowseSection_Season_PageInfo_PageInfo(
            currentPage: currentPage,
            hasNextPage: hasNextPage,
            perPage: perPage
        );
        var pageInfoNextSeason = new GetBrowseSection_NextSeason_PageInfo_PageInfo(
            currentPage: currentPage,
            hasNextPage: hasNextPage,
            perPage: perPage
        );
        var pageInfoTopLastSeason = new GetBrowseSection_TopLastSeason_PageInfo_PageInfo(
            currentPage: currentPage,
            hasNextPage: hasNextPage,
            perPage: perPage
        );
        var pageInfoTop = new GetBrowseSection_Top_PageInfo_PageInfo(
            currentPage: currentPage,
            hasNextPage: hasNextPage,
            perPage: perPage
        );


        var season = new GetBrowseSection_Season_Page(
            pageInfo: pageInfoSeason,
            media: seasonMedia.Cast<IGetBrowseSection_Season_Media>().ToList()
        );
        var nextSeason = new GetBrowseSection_NextSeason_Page(
            pageInfo: pageInfoNextSeason,
            media: nextSeasonMedia.Cast<IGetBrowseSection_NextSeason_Media>().ToList()
        );
        var topLastSeason = new GetBrowseSection_TopLastSeason_Page(
            pageInfo: pageInfoTopLastSeason,
            media: topLastSeasonMedia.Cast<IGetBrowseSection_TopLastSeason_Media>().ToList()
        );
        var top = new GetBrowseSection_Top_Page(
            pageInfo: pageInfoTop,
            media: topMedia.Cast<IGetBrowseSection_Top_Media>().ToList()
        );

        return new GetBrowseSectionResult(
            season: season,
            nextSeason: nextSeason,
            topLastSeason: topLastSeason,
            top: top
        );
    }

    private static IGetBrowseSectionResult CreateMockGetBrowseSectionResult(IGetBrowseSection_Season season, IGetBrowseSection_NextSeason nextSeason, IGetBrowseSection_TopLastSeason topLastSeason, IGetBrowseSection_Top top)
    {
        var mockResult = new Mock<IGetBrowseSectionResult>();
        mockResult.Setup(x => x.Season).Returns(season);
        mockResult.Setup(x => x.NextSeason).Returns(nextSeason);
        mockResult.Setup(x => x.TopLastSeason).Returns(topLastSeason);
        mockResult.Setup(x => x.Top).Returns(top);
        return mockResult.Object;
    }

    #endregion
}
