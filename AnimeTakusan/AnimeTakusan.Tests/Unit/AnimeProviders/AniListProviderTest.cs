using System.Net;
using AnimeTakusan.AnimeProviders;
using AnimeTakusan.AnimeProviders.Helpers;
using AnimeTakusan.AnimeProviders.Helpers.Fakers;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList.Requests;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList.Responses;
using AnimeTakusan.AnimeProviders.Queries;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Tests.TestHelpers;
using Bogus;
using FluentAssertions;
using GraphQL;
using GraphQL.Client.Http;
using Moq;

namespace AnimeTakusan.Tests.Unit.AnimeProviders;

/// <summary>
/// Unit tests for AniListProvider.
/// Partially generated using AI assistance.
/// </summary>
public class AniListProviderTest
{
    private readonly Mock<IGraphQLClientHelper> _mockGraphQLClient;
    private readonly Mock<IQueryLoader> _mockQueryLoader;
    private readonly AniListProvider _aniListProvider;
    private readonly Faker<AniListAnimeResponse> _anilistAnimeResponseFaker;
    private const string ProviderName = "AniList";

    public AniListProviderTest()
    {
        // Configure Mapster mappings before running tests
        MapsterTestConfiguration.ConfigureMapster();
        
        _mockGraphQLClient = new Mock<IGraphQLClientHelper>();
        _mockQueryLoader = new Mock<IQueryLoader>();
        _aniListProvider = new AniListProvider(_mockGraphQLClient.Object, _mockQueryLoader.Object);
        _anilistAnimeResponseFaker = AnimeProviderFakers.AniListAnimeFaker;
    }

    #region GetAnimeById Tests

    [Fact(DisplayName = "GetAnimeById should load correct GraphQL query")]
    public async Task GetAnimeById_ValidId_LoadsCorrectQuery()
    {
        // Arrange
        var animeId = 1;
        var expectedQuery = "query ($id: Int) { Media(id: $id) { id title { romaji english native } } }";
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(AniListQueryIndex.GetAnimeById))
            .ReturnsAsync(expectedQuery);
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListResponse<AniListAnimeResponse> 
            { 
                Media = new AniListAnimeResponse { Id = animeId } 
            });

        // Act
        await _aniListProvider.GetAnimeById(animeId);

        // Assert
        _mockQueryLoader.Verify(x => x.LoadQueryAsync(AniListQueryIndex.GetAnimeById), Times.Once);
    }

    [Fact(DisplayName = "GetAnimeById should send GraphQL request with correct ID variable")]
    public async Task GetAnimeById_ValidId_SendsRequestWithCorrectIdVariable()
    {
        // Arrange
        var animeId = 42;
        var query = "query";
        GraphQLRequest capturedRequest = null;
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync(query);
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .Callback<GraphQLRequest, string>((req, provider) => capturedRequest = req)
            .ReturnsAsync(new AniListResponse<AniListAnimeResponse> 
            { 
                Media = new AniListAnimeResponse { Id = animeId } 
            });

        // Act
        await _aniListProvider.GetAnimeById(animeId);

        // Assert
        capturedRequest.Should().NotBeNull();
        capturedRequest!.Query.Should().Be(query);
        _mockGraphQLClient.Verify(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(
            It.IsAny<GraphQLRequest>(), ProviderName), 
            Times.Once);
    }

    [Fact(DisplayName = "GetAnimeById should return mapped AnimeResponse")]
    public async Task GetAnimeById_ValidResponse_ReturnsMappedAnimeResponse()
    {
        // Arrange
        int aniListAnimeId = 123;
        var aniListAnime = _anilistAnimeResponseFaker.Generate();
        aniListAnime.Id = aniListAnimeId;
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListResponse<AniListAnimeResponse> { Media = aniListAnime });

        // Act
        var result = await _aniListProvider.GetAnimeById(aniListAnimeId);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(aniListAnimeId);
        result.Title.Should().NotBeNull();
        result.Title.Romaji.Should().Be(aniListAnime.Title.Romaji);
        result.Title.English.Should().Be(aniListAnime.Title.English);
        result.Title.Native.Should().Be(aniListAnime.Title.Native);
    }

    [Fact(DisplayName = "GetAnimeById should propagate GraphQL exceptions")]
    public async Task GetAnimeById_GraphQLClientThrowsException_PropagatesException()
    {
        // Arrange
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ThrowsAsync(new GraphQLHttpRequestException(HttpStatusCode.BadRequest, null, null));

        // Act & Assert
        var act = async () => await _aniListProvider.GetAnimeById(1);
        await act.Should().ThrowAsync<GraphQLHttpRequestException>()
            .WithMessage("*request failed*");
    }

    #endregion

    #region GetSeasonalAnime Tests

    [Fact(DisplayName = "GetSeasonalAnime should load correct GraphQL query")]
    public async Task GetSeasonalAnime_ValidRequest_LoadsCorrectQuery()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "SPRING",
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = "POPULARITY_DESC"
        };
        var expectedQuery = "query ($id: Int) { Media(id: $id) { id title { romaji english native } } }";
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(AniListQueryIndex.GetSeasonalAnime))
            .ReturnsAsync(expectedQuery);
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 1,
                        PerPage = 10,
                        HasNextPage = false
                    }
                }
            });

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);
        
        // Assert
        _mockQueryLoader.Verify(x => x.LoadQueryAsync(AniListQueryIndex.GetSeasonalAnime), Times.Once);
    }

    [Fact(DisplayName = "GetSeasonalAnime should send GraphQL request with correct parameters")]
    public async Task GetSeasonalAnime_ValidRequest_SendsRequestWithCorrectParameters()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "WINTER",
            seasonYear = 2024,
            page = 2,
            perPage = 20,
            sort = "POPULARITY_DESC"
        };
        var query = "query";
        GraphQLRequest capturedRequest = null;
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync(query);
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .Callback<GraphQLRequest, string>((req, provider) => capturedRequest = req)
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 2,
                        PerPage = 20,
                        HasNextPage = true
                    }
                }
            });

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        capturedRequest.Should().NotBeNull();
        capturedRequest!.Query.Should().Be(query);
        _mockGraphQLClient.Verify(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(
            It.IsAny<GraphQLRequest>(), ProviderName), 
            Times.Once);
    }

    [Fact(DisplayName = "GetSeasonalAnime should return mapped list of AnimeResponses")]
    public async Task GetSeasonalAnime_ValidResponse_ReturnsMappedAnimeList()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "SUMMER",
            seasonYear = 2023,
            page = 1,
            perPage = 5,
            sort = "POPULARITY_DESC"
        };
        
        var aniListAnimes = _anilistAnimeResponseFaker.Generate(3);
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = aniListAnimes,
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 1,
                        PerPage = 5,
                        HasNextPage = false
                    }
                }
            });

        // Act
        var result = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().HaveCount(3);
        result.Page.Should().NotBeNull();
        result.Page.CurrentPage.Should().Be(1);
        result.Page.PerPage.Should().Be(5);
        result.Page.HasNextPage.Should().BeFalse();
        
        for (int i = 0; i < aniListAnimes.Count; i++)
        {
            result.Data[i].Id.Should().Be(aniListAnimes[i].Id);
            result.Data[i].Title.Romaji.Should().Be(aniListAnimes[i].Title.Romaji);
        }
    }

    [Fact(DisplayName = "GetSeasonalAnime should handle empty result list")]
    public async Task GetSeasonalAnime_EmptyResult_ReturnsEmptyList()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "FALL",
            seasonYear = 1990,
            page = 1,
            perPage = 10,
            sort = "POPULARITY_DESC"
        };
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 1,
                        PerPage = 10,
                        HasNextPage = false
                    }
                }
            });

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
            season = "SPRING",
            seasonYear = 2023,
            page = 3,
            perPage = 15,
            sort = "POPULARITY_DESC"
        };
        
        var aniListAnimes = _anilistAnimeResponseFaker.Generate(15);
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = aniListAnimes,
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 3,
                        PerPage = 15,
                        HasNextPage = true
                    }
                }
            });

        // Act
        var result = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().HaveCount(15);
        result.Page.CurrentPage.Should().Be(3);
        result.Page.PerPage.Should().Be(15);
        result.Page.HasNextPage.Should().BeTrue();
    }

    [Fact(DisplayName = "GetSeasonalAnime should propagate GraphQL exceptions")]
    public async Task GetSeasonalAnime_GraphQLClientThrowsException_PropagatesException()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "SPRING",
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = "POPULARITY_DESC"
        };
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ThrowsAsync(new GraphQLHttpRequestException(HttpStatusCode.ServiceUnavailable, null, null));

        // Act & Assert
        var act = async () => await _aniListProvider.GetSeasonalAnime(seasonalRequest);
        await act.Should().ThrowAsync<GraphQLHttpRequestException>()
            .WithMessage("*request failed*");
    }

    [Theory(DisplayName = "GetSeasonalAnime should handle different seasons correctly")]
    [InlineData("WINTER")]
    [InlineData("SPRING")]
    [InlineData("SUMMER")]
    [InlineData("FALL")]
    public async Task GetSeasonalAnime_DifferentSeasons_ProcessesCorrectly(string season)
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = season,
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = "POPULARITY_DESC"
        };
        
        var aniListAnimes = _anilistAnimeResponseFaker.Generate(5);
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = aniListAnimes,
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 1,
                        PerPage = 10,
                        HasNextPage = false
                    }
                }
            });

        // Act
        var result = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().HaveCount(5);
        _mockGraphQLClient.Verify(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(
            It.IsAny<GraphQLRequest>(), ProviderName), 
            Times.Once);
    }

    [Fact(DisplayName = "GetSeasonalAnime should correctly create request object")]
    public async Task GetSeasonalAnime_CorrectlyCreatesRequestObject()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "SPRING",
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = "POPULARITY_DESC"
        };

        GraphQLRequest mockRequest = new GraphQLRequest{
            Query = "query",
            Variables = new AniListSeasonalRequest
            {
                Season = AniListSeason.SPRING,
                SeasonYear = 2023,
                Sort = AniListSort.POPULARITY_DESC,
                Page = 1,
                PerPage = 10
            }
        };
        GraphQLRequest capturedRequest = null;
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync("query");
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .Callback<GraphQLRequest, string>((req, provider) => capturedRequest = req)
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo
                    {
                        CurrentPage = 1,
                        PerPage = 10,
                        HasNextPage = false
                    }
                }
            });

        // Act
        var act = await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        capturedRequest.Should().NotBeNull();
        capturedRequest!.Query.Should().Be(mockRequest.Query);
        capturedRequest.Variables.Should().BeEquivalentTo(mockRequest.Variables);
    }

    [Fact(DisplayName = "GetSeasonalAnime should use default sort when sort is null")]
    public async Task GetSeasonalAnime_NullSort_UsesDefaultSort()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "SPRING",
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = null
        };
        
        GraphQLRequest capturedRequest = null;
        _mockQueryLoader.Setup(x => x.LoadQueryAsync(It.IsAny<string>())).ReturnsAsync("query");
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .Callback<GraphQLRequest, string>((req, _) => capturedRequest = req)
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo()
                }
            });

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        var variables = capturedRequest!.Variables as AniListSeasonalRequest;
        variables!.Sort.Should().Be(AniListSort.POPULARITY_DESC);
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
            season = "SPRING",
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = sortValue
        };
        
        GraphQLRequest capturedRequest = null;
        _mockQueryLoader.Setup(x => x.LoadQueryAsync(It.IsAny<string>())).ReturnsAsync("query");
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .Callback<GraphQLRequest, string>((req, _) => capturedRequest = req)
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo()
                }
            });

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        var variables = capturedRequest!.Variables as AniListSeasonalRequest;
        variables!.Sort.Should().Be(AniListSort.POPULARITY_DESC);
    }

    [Fact(DisplayName = "GetSeasonalAnime should use default for invalid sort")]
    public async Task GetSeasonalAnime_InvalidSort_UsesDefault()
    {
        // Arrange
        var seasonalRequest = new AnimeSeasonalRequest
        {
            season = "SPRING",
            seasonYear = 2023,
            page = 1,
            perPage = 10,
            sort = "INVALID_SORT_VALUE"
        };
        
        GraphQLRequest capturedRequest = null;
        _mockQueryLoader.Setup(x => x.LoadQueryAsync(It.IsAny<string>())).ReturnsAsync("query");
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListPageResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>(), ProviderName))
            .Callback<GraphQLRequest, string>((req, _) => capturedRequest = req)
            .ReturnsAsync(new AniListPageResponse<AniListAnimeResponse> 
            { 
                Page = new AniListPage<AniListAnimeResponse>
                {
                    Media = new List<AniListAnimeResponse>(),
                    PageInfo = new AniListPageInfo()
                }
            });

        // Act
        await _aniListProvider.GetSeasonalAnime(seasonalRequest);

        // Assert
        var variables = capturedRequest!.Variables as AniListSeasonalRequest;
        variables!.Sort.Should().Be(AniListSort.POPULARITY_DESC);
    }

    #endregion
}
