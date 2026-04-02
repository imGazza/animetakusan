using System.Security.Claims;
using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Services;
using AnimeTakusan.Domain.Entities;
using AnimeTakusan.Domain.Exceptions.AuthenticationExceptions;
using AnimeTakusan.Tests.TestHelpers.Fakers;
using Bogus;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace AnimeTakusan.Tests.Unit.Application.Services;

public class AniListAuthServiceTests
{
    private readonly Mock<IJwtHandler> _mockJwtHandler;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<ILogger<AniListAuthService>> _mockLogger;
    private readonly AniListAuthService _aniListAuthService;
    private readonly Faker<User> _userFaker;

    public AniListAuthServiceTests()
    {
        _mockJwtHandler = new Mock<IJwtHandler>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockLogger = new Mock<ILogger<AniListAuthService>>();

        _aniListAuthService = new AniListAuthService(
            _mockJwtHandler.Object,
            _mockUserRepository.Object,
            _mockLogger.Object
        );

        _userFaker = AuthenticationFakers.UserFaker;
    }

    #region VerifyCallbackState Tests

    [Fact(DisplayName = "VerifyCallbackState should throw ArgumentException when code is null")]
    public void VerifyCallbackState_NullCode_ThrowsArgumentException()
    {
        // Act
        var act = () => _aniListAuthService.VerifyCallbackState(null);

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("Authorization code is missing.");
    }

    [Fact(DisplayName = "VerifyCallbackState should throw ArgumentException when code is empty")]
    public void VerifyCallbackState_EmptyCode_ThrowsArgumentException()
    {
        // Act
        var act = () => _aniListAuthService.VerifyCallbackState(string.Empty);

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("Authorization code is missing.");
    }

    [Fact(DisplayName = "VerifyCallbackState should throw InvalidOperationException when no refresh token exists")]
    public void VerifyCallbackState_NoRefreshToken_ThrowsInvalidOperationException()
    {
        // Arrange
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(string.Empty);

        // Act
        var act = () => _aniListAuthService.VerifyCallbackState("valid-code");

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot verify logged user.");
    }

    [Fact(DisplayName = "VerifyCallbackState should complete without throwing when code and refresh token are valid")]
    public void VerifyCallbackState_ValidCodeAndRefreshToken_DoesNotThrow()
    {
        // Arrange
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns("valid-refresh-token");

        // Act
        var act = () => _aniListAuthService.VerifyCallbackState("valid-code");

        // Assert
        act.Should().NotThrow();
        _mockJwtHandler.Verify(x => x.GetRefreshToken(), Times.Once);
    }

    #endregion

    #region LinkAniListAccountToUser Tests

    [Fact(DisplayName = "LinkAniListAccountToUser should throw AniListAuthenticationException when token data is null")]
    public async Task LinkAniListAccountToUser_NullTokenData_ThrowsAniListAuthenticationException()
    {
        // Act
        var act = async () => await _aniListAuthService.LinkAniListAccountToUser(null);

        // Assert
        await act.Should().ThrowAsync<AniListAuthenticationException>()
            .WithMessage("*Access token is missing*");
    }

    [Fact(DisplayName = "LinkAniListAccountToUser should throw AniListAuthenticationException when access token is empty")]
    public async Task LinkAniListAccountToUser_EmptyAccessToken_ThrowsAniListAuthenticationException()
    {
        // Arrange
        var tokenData = new AniListTokenResponse { AccessToken = string.Empty, ExpiresIn = 3600 };

        // Act
        var act = async () => await _aniListAuthService.LinkAniListAccountToUser(tokenData);

        // Assert
        await act.Should().ThrowAsync<AniListAuthenticationException>()
            .WithMessage("*Access token is missing*");
    }

    [Fact(DisplayName = "LinkAniListAccountToUser should throw AniListAuthenticationException when token has no sub claim")]
    public async Task LinkAniListAccountToUser_NoSubClaim_ThrowsAniListAuthenticationException()
    {
        // Arrange
        var tokenData = new AniListTokenResponse { AccessToken = "valid.jwt.token", ExpiresIn = 3600 };
        _mockJwtHandler.Setup(x => x.GetAniListTokenClaims(tokenData.AccessToken))
            .Returns(new List<Claim>());

        // Act
        var act = async () => await _aniListAuthService.LinkAniListAccountToUser(tokenData);

        // Assert
        await act.Should().ThrowAsync<AniListAuthenticationException>()
            .WithMessage("*valid AniList user ID*");
    }

    [Fact(DisplayName = "LinkAniListAccountToUser should throw AniListAuthenticationException when sub claim is not a valid integer")]
    public async Task LinkAniListAccountToUser_SubClaimNotInteger_ThrowsAniListAuthenticationException()
    {
        // Arrange
        var tokenData = new AniListTokenResponse { AccessToken = "valid.jwt.token", ExpiresIn = 3600 };
        _mockJwtHandler.Setup(x => x.GetAniListTokenClaims(tokenData.AccessToken))
            .Returns(new List<Claim> { new Claim("sub", "not-an-integer") });

        // Act
        var act = async () => await _aniListAuthService.LinkAniListAccountToUser(tokenData);

        // Assert
        await act.Should().ThrowAsync<AniListAuthenticationException>()
            .WithMessage("*valid AniList user ID*");
    }

    [Fact(DisplayName = "LinkAniListAccountToUser should throw AniListAuthenticationException when logged user is not found")]
    public async Task LinkAniListAccountToUser_UserNotFound_ThrowsAniListAuthenticationException()
    {
        // Arrange
        var tokenData = new AniListTokenResponse { AccessToken = "valid.jwt.token", ExpiresIn = 3600 };
        _mockJwtHandler.Setup(x => x.GetAniListTokenClaims(tokenData.AccessToken))
            .Returns(new List<Claim> { new Claim("sub", "12345") });
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns("refresh-token");
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken("refresh-token"))
            .ReturnsAsync((User)null);

        // Act
        var act = async () => await _aniListAuthService.LinkAniListAccountToUser(tokenData);

        // Assert
        await act.Should().ThrowAsync<AniListAuthenticationException>()
            .WithMessage("*logged user not found*");
    }

    [Fact(DisplayName = "LinkAniListAccountToUser should throw AniListAuthenticationException when AddAniListUserAsync fails")]
    public async Task LinkAniListAccountToUser_AddAniListUserFails_ThrowsAniListAuthenticationException()
    {
        // Arrange
        var user = _userFaker.Generate();
        var tokenData = new AniListTokenResponse { AccessToken = "valid.jwt.token", ExpiresIn = 3600 };
        _mockJwtHandler.Setup(x => x.GetAniListTokenClaims(tokenData.AccessToken))
            .Returns(new List<Claim> { new Claim("sub", "12345") });
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns("refresh-token");
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken("refresh-token"))
            .ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.AddAniListUserAsync(It.IsAny<AniListUser>()))
            .ThrowsAsync(new Exception("Database error"));

        // Act
        var act = async () => await _aniListAuthService.LinkAniListAccountToUser(tokenData);

        // Assert
        await act.Should().ThrowAsync<AniListAuthenticationException>()
            .WithMessage("*Failed to link AniList account*");
    }

    [Fact(DisplayName = "LinkAniListAccountToUser should successfully link AniList account to user")]
    public async Task LinkAniListAccountToUser_ValidData_CallsAddAniListUserWithCorrectData()
    {
        // Arrange
        var user = _userFaker.Generate();
        var aniListUserId = 12345;
        var tokenData = new AniListTokenResponse { AccessToken = "valid.jwt.token", ExpiresIn = 3600 };
        _mockJwtHandler.Setup(x => x.GetAniListTokenClaims(tokenData.AccessToken))
            .Returns(new List<Claim> { new Claim("sub", aniListUserId.ToString()) });
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns("refresh-token");
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken("refresh-token"))
            .ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.AddAniListUserAsync(It.IsAny<AniListUser>()))
            .Returns(Task.CompletedTask);

        // Act
        await _aniListAuthService.LinkAniListAccountToUser(tokenData);

        // Assert
        _mockUserRepository.Verify(x => x.AddAniListUserAsync(It.Is<AniListUser>(a =>
            a.AniListUserId == aniListUserId &&
            a.UserId == user.Id &&
            a.AccessToken == tokenData.AccessToken
        )), Times.Once);
    }

    #endregion
}
