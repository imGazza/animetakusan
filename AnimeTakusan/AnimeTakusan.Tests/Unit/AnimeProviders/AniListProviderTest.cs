using AnimeTakusan.AnimeProviders;
using AnimeTakusan.AnimeProviders.Helpers;
using AnimeTakusan.AnimeProviders.Helpers.Fakers;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList;
using AnimeTakusan.AnimeProviders.ProviderModels.AniList.Responses;
using AnimeTakusan.AnimeProviders.Queries;
using Bogus;
using FluentAssertions;
using GraphQL;
using Moq;

namespace AnimeTakusan.Tests.Unit.AnimeProviders;

/// <summary>
/// Unit tests for AniListProvider.
/// </summary>
public class AniListProviderTest
{
    private readonly Mock<IGraphQLClientHelper> _mockGraphQLClient;
    private readonly Mock<IQueryLoader> _mockQueryLoader;
    private readonly AniListProvider _aniListProvider;
    private readonly Faker<AniListAnimeResponse> _anilistAnimeResponseFaker;

    public AniListProviderTest()
    {
        _mockGraphQLClient = new Mock<IGraphQLClientHelper>();
        _mockQueryLoader = new Mock<IQueryLoader>();
        _aniListProvider = new AniListProvider(_mockGraphQLClient.Object, _mockQueryLoader.Object, null);
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
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>()))
            .ReturnsAsync(new AniListResponse<AniListAnimeResponse> 
            { 
                Media = new AniListAnimeResponse { Id = animeId } 
            });

        // Act
        await _aniListProvider.GetAnimeById(animeId);

        // Assert
        _mockQueryLoader.Verify(x => x.LoadQueryAsync(AniListQueryIndex.GetAnimeById), Times.Once);
    }

    [Fact(DisplayName = "GetAnimeById should send GraphQL request with correct variables")]
    public async Task GetAnimeById_ValidId_SendsRequestWithCorrectVariables()
    {
        // Arrange
        var animeId = 42;
        var query = "query";
        
        _mockQueryLoader
            .Setup(x => x.LoadQueryAsync(It.IsAny<string>()))
            .ReturnsAsync(query);
        
        _mockGraphQLClient
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>()))
            .ReturnsAsync(new AniListResponse<AniListAnimeResponse> 
            { 
                Media = new AniListAnimeResponse { Id = animeId } 
            });

        // Act
        await _aniListProvider.GetAnimeById(animeId);

        // Assert
        _mockGraphQLClient.Verify(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(
            It.Is<GraphQLRequest>(req => 
                req.Query == query && 
                req.Variables.ToString().Contains(animeId.ToString()))), 
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
            .Setup(x => x.SendQueryAsync<AniListResponse<AniListAnimeResponse>>(It.IsAny<GraphQLRequest>()))
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

    #endregion
}
