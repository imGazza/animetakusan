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
    private readonly AniListProvider _aniListProvider;
    private readonly Faker<GetAnimeById_Media_Media> _animeFaker;
    private readonly Faker<GetSeasonalAnime_Page_Media_Media> _pageAnimeFaker;

    private const string ProviderName = "AniList";

    public AniListProviderTest()
    {
        // Configure Mapster mappings before running tests
        MapsterTestConfiguration.ConfigureMapster();
        
        _mockAniListClient = new Mock<IAniListClient>();
        _mockGetAnimeByIdQuery = new Mock<IGetAnimeByIdQuery>();
        _mockGetSeasonalAnimeQuery = new Mock<IGetSeasonalAnimeQuery>();
        
        _mockAniListClient.Setup(x => x.GetAnimeById).Returns(_mockGetAnimeByIdQuery.Object);
        _mockAniListClient.Setup(x => x.GetSeasonalAnime).Returns(_mockGetSeasonalAnimeQuery.Object);
        
        _aniListProvider = new AniListProvider(_mockAniListClient.Object);
        _animeFaker = AniListProviderFakers.AniListAnimeFaker;
        _pageAnimeFaker = AniListProviderFakers.AniListPageAnimeFaker;
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
        
        var mockMediaList = _pageAnimeFaker.Generate(3);
        
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
        
        var mockMediaList = _pageAnimeFaker.Generate(15);
        
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

    #endregion
}
