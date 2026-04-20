using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Services;
using AnimeTakusan.Application.Utility;
using FluentAssertions;
using Moq;

namespace AnimeTakusan.Tests.Unit.Application.Services;

public class AnimeServiceTests
{
    private readonly Mock<IAnimeProvider> _mockAnimeProvider;
    private readonly AnimeService _animeService;

    public AnimeServiceTests()
    {
        _mockAnimeProvider = new Mock<IAnimeProvider>();
        _animeService = new AnimeService(_mockAnimeProvider.Object);
    }

    #region GetAnimeById Tests

    [Fact(DisplayName = "GetAnimeById should call provider with the correct id")]
    public async Task GetAnimeById_ValidId_CallsProviderWithCorrectId()
    {
        // Arrange
        var id = 42;
        var expected = new AnimeDetailResponse { Id = id };
        _mockAnimeProvider.Setup(x => x.GetAnimeById(id)).ReturnsAsync(expected);

        // Act
        var result = await _animeService.GetAnimeById(id);

        // Assert
        _mockAnimeProvider.Verify(x => x.GetAnimeById(id), Times.Once);
        result.Should().Be(expected);
    }

    #endregion

    #region GetSeasonalAnime Tests

    [Fact(DisplayName = "GetSeasonalAnime should call provider with current season and year")]
    public async Task GetSeasonalAnime_CallsProviderWithCurrentSeasonRequest()
    {
        // Arrange
        var expected = new AnimePageResponse();
        var expectedSeason = SeasonUtility.GetCurrentSeason(DateTime.Now);
        var expectedYear = SeasonUtility.GetCurrentSeasonYear(DateTime.Now);

        _mockAnimeProvider
            .Setup(x => x.GetSeasonalAnime(It.Is<AnimeSeasonalRequest>(r =>
                r.Season == expectedSeason &&
                r.SeasonYear == expectedYear)))
            .ReturnsAsync(expected);

        // Act
        var result = await _animeService.GetSeasonalAnime();

        // Assert
        _mockAnimeProvider.Verify(x => x.GetSeasonalAnime(It.Is<AnimeSeasonalRequest>(r =>
            r.Season == expectedSeason &&
            r.SeasonYear == expectedYear)), Times.Once);
        result.Should().Be(expected);
    }

    #endregion

    #region GetAnimeBrowseSection Tests

    [Fact(DisplayName = "GetAnimeBrowseSection should call provider with correct season fields")]
    public async Task GetAnimeBrowseSection_CallsProviderWithCorrectBrowseRequest()
    {
        // Arrange
        var expected = new AnimeBrowseResponse();
        var currentSeason = SeasonUtility.GetCurrentSeason(DateTime.Now);
        var currentYear = SeasonUtility.GetCurrentSeasonYear(DateTime.Now);
        var nextSeason = SeasonUtility.GetNextSeason(currentSeason);
        var nextYear = SeasonUtility.GetNextSeasonYear(currentSeason, currentYear);
        var lastSeason = SeasonUtility.GetLastSeason(currentSeason);
        var lastYear = SeasonUtility.GetLastSeasonYear(currentSeason, currentYear);

        _mockAnimeProvider
            .Setup(x => x.GetAnimeBrowseSection(It.Is<AnimeBrowseSectionRequest>(r =>
                r.Season == currentSeason &&
                r.SeasonYear == currentYear &&
                r.NextSeason == nextSeason &&
                r.NextSeasonYear == nextYear &&
                r.LastSeason == lastSeason &&
                r.LastSeasonYear == lastYear)))
            .ReturnsAsync(expected);

        // Act
        var result = await _animeService.GetAnimeBrowseSection();

        // Assert
        _mockAnimeProvider.Verify(x => x.GetAnimeBrowseSection(It.Is<AnimeBrowseSectionRequest>(r =>
            r.Season == currentSeason &&
            r.SeasonYear == currentYear &&
            r.NextSeason == nextSeason &&
            r.NextSeasonYear == nextYear &&
            r.LastSeason == lastSeason &&
            r.LastSeasonYear == lastYear)), Times.Once);
        result.Should().Be(expected);
    }

    #endregion

    #region GetAnime Tests

    [Fact(DisplayName = "GetAnime should call provider with the same filter request")]
    public async Task GetAnime_ValidFilterRequest_CallsProviderWithSameRequest()
    {
        // Arrange
        var request = new AnimeFilterRequest { Page = new AnimePage { Page = 2, PerPage = 10 }, Filter = new AnimeFilter { Search = "Naruto" } };
        var expected = new AnimePageResponse();
        _mockAnimeProvider.Setup(x => x.GetAnime(request)).ReturnsAsync(expected);

        // Act
        var result = await _animeService.GetAnime(request);

        // Assert
        _mockAnimeProvider.Verify(x => x.GetAnime(request), Times.Once);
        result.Should().Be(expected);
    }

    #endregion

    #region GetUserAnimeList Tests

    [Fact(DisplayName = "GetUserAnimeList should call provider with the correct user id")]
    public async Task GetUserAnimeList_ValidUserId_CallsProviderWithCorrectUserId()
    {
        // Arrange
        var userId = 99;
        var expected = new AnimeUserListResponse();
        _mockAnimeProvider.Setup(x => x.GetUserAnimeList(userId)).ReturnsAsync(expected);

        // Act
        var result = await _animeService.GetUserAnimeList(userId);

        // Assert
        _mockAnimeProvider.Verify(x => x.GetUserAnimeList(userId), Times.Once);
        result.Should().Be(expected);
    }

    #endregion
}
