using System.Security.Claims;
using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Services;
using AnimeTakusan.Domain.Entities;
using AnimeTakusan.Domain.Exceptions;
using AnimeTakusan.Infrastructure.DataPersistence.Migrations;
using AnimeTakusan.Tests.Authentication.Bogus;
using Bogus;
using FluentAssertions;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;

namespace AnimeTakusan.Tests;

/// <summary>
/// Unit tests for AuthService following DDD principles and SOLID design.
/// Tests validate application service orchestration, business rules, and error handling.
/// </summary>
public class AuthenticationTests
{
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IJwtHandler> _mockJwtHandler;
    private readonly Mock<ILogger<AuthService>> _mockLogger;
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<RoleManager<IdentityRole<Guid>>> _mockRoleManager;
    private readonly Mock<IPasswordHasher<User>> _mockPasswordHasher;
    private readonly Mock<IValidator<LoginRequest>> _mockLoginRequestValidator;
    private readonly Mock<IValidator<RegisterRequest>> _mockRegisterRequestValidator;
    private readonly AuthService _authService;
    private readonly Faker<User> _userFaker;
    private readonly Faker<RegisterRequest> _registerRequestFaker;
    private readonly Faker<LoginRequest> _loginRequestFaker;

    public AuthenticationTests()
    {
        // Setup mocks
        _mockUserRepository = new Mock<IUserRepository>();
        _mockJwtHandler = new Mock<IJwtHandler>();
        _mockLogger = new Mock<ILogger<AuthService>>();
        _mockPasswordHasher = new Mock<IPasswordHasher<User>>();
        _mockLoginRequestValidator = new Mock<IValidator<LoginRequest>>();
        _mockRegisterRequestValidator = new Mock<IValidator<RegisterRequest>>();

        // Mock UserManager (requires complex setup due to concrete class with many dependencies)
        var userStore = new Mock<IUserStore<User>>();
        _mockUserManager = new Mock<UserManager<User>>(
            userStore.Object, null, _mockPasswordHasher.Object, null, null, null, null, null, null);

        // Mock RoleManager
        var roleStore = new Mock<IRoleStore<IdentityRole<Guid>>>();
        _mockRoleManager = new Mock<RoleManager<IdentityRole<Guid>>>(
            roleStore.Object, null, null, null, null);

        // Create service under test
        _authService = new AuthService(
            _mockUserRepository.Object,
            _mockJwtHandler.Object,
            _mockLogger.Object,
            _mockUserManager.Object,
            _mockRoleManager.Object,
            _mockLoginRequestValidator.Object,
            _mockRegisterRequestValidator.Object
        );

        // Setup Bogus fakers for test data using centralized mock configuration
        _userFaker = AuthenticationMock.UserFaker;
        _registerRequestFaker = AuthenticationMock.RegisterRequestFaker;
        _loginRequestFaker = AuthenticationMock.LoginRequestFaker;
    }

    #region Token Method Tests

    [Fact(DisplayName = "Token should return guest access token when no refresh token exists")]
    public async Task Token_NoRefreshTokenExists_ReturnsGuestAccessToken()
    {
        // Arrange
        var guestToken = "guest-access-token";
        var expiresAt = DateTime.UtcNow.AddMinutes(15);
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(string.Empty);
        _mockJwtHandler.Setup(x => x.GenerateGuestAccessToken()).Returns((guestToken, expiresAt));

        // Act
        var result = await _authService.Token();

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be(guestToken);
        result.ExpiresAt.Should().Be(expiresAt);
        _mockJwtHandler.Verify(x => x.GenerateGuestAccessToken(), Times.Once);
    }

    [Fact(DisplayName = "Token should return guest access token when refresh token is invalid")]
    public async Task Token_InvalidRefreshToken_ReturnsGuestAccessToken()
    {
        // Arrange
        var guestToken = "guest-access-token";
        var expiresAt = DateTime.UtcNow.AddMinutes(15);
        var invalidRefreshToken = "invalid-token";

        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(invalidRefreshToken);
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken(invalidRefreshToken))
            .ReturnsAsync((User)null);
        _mockJwtHandler.Setup(x => x.GenerateGuestAccessToken()).Returns((guestToken, expiresAt));

        // Act
        var result = await _authService.Token();

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be(guestToken);
        result.ExpiresAt.Should().Be(expiresAt);
    }

    [Fact(DisplayName = "Token should return guest access token when refresh token is expired")]
    public async Task Token_ExpiredRefreshToken_ReturnsGuestAccessToken()
    {
        // Arrange
        var guestToken = "guest-access-token";
        var expiresAt = DateTime.UtcNow.AddMinutes(15);
        var expiredRefreshToken = "expired-token";
        var user = _userFaker.Generate();
        user.RefreshToken = expiredRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(-1); // Expired

        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(expiredRefreshToken);
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken(expiredRefreshToken))
            .ReturnsAsync(user);
        _mockJwtHandler.Setup(x => x.GenerateGuestAccessToken()).Returns((guestToken, expiresAt));

        // Act
        var result = await _authService.Token();

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be(guestToken);
        result.ExpiresAt.Should().Be(expiresAt);
    }

    [Fact(DisplayName = "Token should return user access token when refresh token is valid")]
    public async Task Token_ValidRefreshToken_ReturnsUserAccessToken()
    {
        // Arrange
        var validRefreshToken = "valid-token";
        var newRefreshToken = "new-refresh-token";
        var accessToken = "user-access-token";
        var expiresAt = DateTime.UtcNow.AddMinutes(15);
        var user = _userFaker.Generate();
        user.RefreshToken = validRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Valid
        var roles = new List<string> { "User" };

        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(validRefreshToken);
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken(validRefreshToken))
            .ReturnsAsync(user);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns(newRefreshToken);
        _mockJwtHandler.Setup(x => x.GenerateUserAccessToken(validRefreshToken, user, roles))
            .Returns((accessToken, expiresAt));
        _mockUserManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(roles);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _authService.Token();

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be(accessToken);
        result.ExpiresAt.Should().Be(expiresAt);
        _mockJwtHandler.Verify(x => x.WriteRefreshTokenCookie(newRefreshToken), Times.Once);
        _mockUserManager.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.RefreshToken == newRefreshToken &&
            u.RefreshTokenExpiryTime > DateTime.UtcNow)), Times.Once);
    }

    #endregion

    #region Login Method Tests

    [Fact(DisplayName = "Login should throw LoginFailedException when user does not exist")]
    public async Task Login_UserDoesNotExist_ThrowsLoginFailedException()
    {
        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync((User)null);

        // Act
        var act = async () => await _authService.Login(loginRequest);

        // Assert
        await act.Should().ThrowAsync<LoginFailedException>();
    }

    [Fact(DisplayName = "Login should throw LoginFailedException when password is incorrect")]
    public async Task Login_IncorrectPassword_ThrowsLoginFailedException()
    {
        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        var user = _userFaker.Generate();
        user.Email = loginRequest.Email;

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.CheckPasswordAsync(user, loginRequest.Password))
            .ReturnsAsync(false);

        // Act
        var act = async () => await _authService.Login(loginRequest);

        // Assert
        await act.Should().ThrowAsync<LoginFailedException>();
    }

    [Fact(DisplayName = "Login should set refresh token when credentials are valid")]
    public async Task Login_ValidCredentials_SetsRefreshToken()
    {
        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        var user = _userFaker.Generate();
        user.Email = loginRequest.Email;
        var newRefreshToken = "new-refresh-token";

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.CheckPasswordAsync(user, loginRequest.Password))
            .ReturnsAsync(true);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns(newRefreshToken);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        await _authService.Login(loginRequest);

        // Assert
        _mockJwtHandler.Verify(x => x.WriteRefreshTokenCookie(newRefreshToken), Times.Once);
        _mockUserManager.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.RefreshToken == newRefreshToken &&
            u.RefreshTokenExpiryTime > DateTime.UtcNow)), Times.Once);
    }

    [Fact(DisplayName = "Login should update refresh token and expiry time")]
    public async Task Login_ValidCredentials_UpdatesRefreshTokenAndExpiryTime()
    {
        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        var user = _userFaker.Generate();
        user.Email = loginRequest.Email;
        var newRefreshToken = "new-refresh-token";
        var roles = new List<string> { "User" };

        _mockUserManager.Setup(x => x.FindByEmailAsync(loginRequest.Email))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.CheckPasswordAsync(user, loginRequest.Password))
            .ReturnsAsync(true);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns(newRefreshToken);
        _mockUserManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(roles);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        await _authService.Login(loginRequest);

        // Assert
        _mockUserManager.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.RefreshToken == newRefreshToken &&
            u.RefreshTokenExpiryTime > DateTime.UtcNow &&
            u.RefreshTokenExpiryTime <= DateTime.UtcNow.AddDays(8))), Times.Once);
    }

    #endregion

    #region Logout Method Tests

    [Fact(DisplayName = "Logout should return when refresh token doesn't exist")]
    public async Task Logout_NoRefreshToken_Returns()
    {
        // Arrange
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns((string)null);

        // Act
        await _authService.Logout();

        // Assert
        _mockUserManager.Verify(x => x.UpdateAsync(It.IsAny<User>()), Times.Never);
        _mockJwtHandler.Verify(x => x.DeleteRefreshTokenCookie(), Times.Never);
    }

    [Fact(DisplayName = "Logout should return when no user is found for refresh token")]
    public async Task Logout_NoUserFoundForRefreshToken_Returns()
    {
        // Arrange
        var refreshToken = "refresh-token";
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(refreshToken);
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken(refreshToken))
            .ReturnsAsync((User)null);

        // Act
        await _authService.Logout();

        // Assert
        _mockUserManager.Verify(x => x.UpdateAsync(It.IsAny<User>()), Times.Never);
        _mockJwtHandler.Verify(x => x.DeleteRefreshTokenCookie(), Times.Never);
    }

    [Fact(DisplayName = "Logout should clear refresh token and expiry time")]
    public async Task Logout_ClearsRefreshTokenAndExpiryTime()
    {
        // Arrange
        var refreshToken = "refresh-token";
        _mockJwtHandler.Setup(x => x.GetRefreshToken()).Returns(refreshToken);
        var user = _userFaker.Generate();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        _mockUserRepository.Setup(x => x.GetUserByRefreshToken(refreshToken))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        //Act
        await _authService.Logout();

        // Assert
        _mockUserManager.Verify(x => x.UpdateAsync(It.Is<User>(u =>
            u.RefreshToken == null &&
            u.RefreshTokenExpiryTime == null)), Times.Once);
        _mockJwtHandler.Verify(x => x.DeleteRefreshTokenCookie(), Times.Once);
    }

    #endregion

    #region SignUp Method Tests

    [Fact(DisplayName = "SignUp should throw UserAlreadySignedUpException when email already exists")]
    public async Task SignUp_EmailAlreadyExists_ThrowsUserAlreadySignedUpException()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();
        var existingUser = _userFaker.Generate();
        existingUser.Email = registerRequest.Email;

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync(existingUser);

        // Act
        var act = async () => await _authService.SignUp(registerRequest);

        // Assert
        await act.Should().ThrowAsync<UserAlreadySignedUpException>()
            .WithMessage($"*{registerRequest.Email}*");
    }

    [Fact(DisplayName = "SignUp should throw RegistrationFailedException when user creation fails")]
    public async Task SignUp_UserCreationFails_ThrowsRegistrationFailedException()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();
        var identityErrors = new[]
        {
            new IdentityError { Code = "Error1", Description = "Error description" }
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User)null);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<User>(), registerRequest.Password))
            .Returns("hashed-password");
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Failed(identityErrors));

        // Act
        var act = async () => await _authService.SignUp(registerRequest);

        // Assert
        await act.Should().ThrowAsync<RegistrationFailedException>()
            .WithMessage($"*{registerRequest.Email}*");
    }

    [Fact(DisplayName = "SignUp should create user with hashed password")]
    public async Task SignUp_ValidRequest_CreatesUserWithHashedPassword()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();
        var hashedPassword = "hashed-password";

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User)null);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<User>(), registerRequest.Password))
            .Returns(hashedPassword);
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(true);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("Guest")).ReturnsAsync(true);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "Guest"))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        await _authService.SignUp(registerRequest);

        // Assert
        _mockUserManager.Verify(x => x.CreateAsync(It.Is<User>(u =>
            u.UserName == registerRequest.Username &&
            u.Email == registerRequest.Email &&
            u.PasswordHash == hashedPassword)), Times.Once);
    }

    [Fact(DisplayName = "SignUp should assign User role to new user")]
    public async Task SignUp_ValidRequest_AssignsUserRole()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User)null);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<User>(), registerRequest.Password))
            .Returns("hashed-password");
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("Guest")).ReturnsAsync(true);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(true);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "Guest"))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        await _authService.SignUp(registerRequest);

        // Assert
        _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), "Guest"), Times.Once);
        _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), "User"), Times.Once);
    }

    [Fact(DisplayName = "SignUp should create User role if it does not exist")]
    public async Task SignUp_UserRoleDoesNotExist_CreatesUserRole()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User)null);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<User>(), registerRequest.Password))
            .Returns("hashed-password");
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(false);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("Guest")).ReturnsAsync(true);
        _mockRoleManager.Setup(x => x.CreateAsync(It.IsAny<IdentityRole<Guid>>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "Guest"))
        .ReturnsAsync(IdentityResult.Success);

        // Act
        await _authService.SignUp(registerRequest);

        // Assert
        _mockRoleManager.Verify(x => x.CreateAsync(It.Is<IdentityRole<Guid>>(r => r.Name == "User")), Times.Once);        
    }

    [Fact(DisplayName = "SignUp should throw RoleCreationException when role creation fails")]
    public async Task SignUp_RoleCreationFails_ThrowsRoleCreationException()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();
        var identityErrors = new[]
        {
            new IdentityError { Code = "RoleError", Description = "Role creation failed" }
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User)null);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<User>(), registerRequest.Password))
            .Returns("hashed-password");
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(false);
        _mockRoleManager.Setup(x => x.CreateAsync(It.IsAny<IdentityRole<Guid>>()))
            .ReturnsAsync(IdentityResult.Failed(identityErrors));

        // Act
        var act = async () => await _authService.SignUp(registerRequest);

        // Assert
        await act.Should().ThrowAsync<RoleCreationException>()
            .WithMessage("*Role creation failed*");
    }

    [Fact(DisplayName = "SignUp should throw RoleAssignmentException when role assignment fails")]
    public async Task SignUp_RoleAssignmentFails_ThrowsRoleAssignmentException()
    {
        // Arrange
        var registerRequest = _registerRequestFaker.Generate();
        var identityErrors = new[]
        {
            new IdentityError { Code = "AssignmentError", Description = "Role assignment failed" }
        };

        _mockUserManager.Setup(x => x.FindByEmailAsync(registerRequest.Email))
            .ReturnsAsync((User)null);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<User>(), registerRequest.Password))
            .Returns("hashed-password");
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(true);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Failed(identityErrors));
        _mockRoleManager.Setup(x => x.RoleExistsAsync("Guest")).ReturnsAsync(true);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "Guest"))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var act = async () => await _authService.SignUp(registerRequest);

        // Assert
        await act.Should().ThrowAsync<RoleAssignmentException>()
            .WithMessage("*Role assignment failed*");
    }

    #endregion

    #region AuthenticateWithGoogle Method Tests

    [Fact(DisplayName = "AuthenticateWithGoogle should throw ExternalLoginException when ClaimsPrincipal is null")]
    public async Task AuthenticateWithGoogle_NullClaimsPrincipal_ThrowsExternalLoginException()
    {
        // Arrange
        ClaimsPrincipal claimsPrincipal = null;

        // Act
        var act = async () => await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        await act.Should().ThrowAsync<ExternalLoginException>()
            .WithMessage("*Google*ClaimsPrincipal*");
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should throw ExternalLoginException when email claim is missing")]
    public async Task AuthenticateWithGoogle_MissingEmailClaim_ThrowsExternalLoginException()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "google-id-123"),
            new Claim(ClaimTypes.GivenName, "John")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        // Act
        var act = async () => await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        await act.Should().ThrowAsync<ExternalLoginException>()
            .WithMessage("*Google*Email*");
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should throw ExternalLoginException when email claim is empty")]
    public async Task AuthenticateWithGoogle_EmptyEmailClaim_ThrowsExternalLoginException()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, ""),
            new Claim(ClaimTypes.NameIdentifier, "google-id-123")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        // Act
        var act = async () => await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        await act.Should().ThrowAsync<ExternalLoginException>()
            .WithMessage("*Google*Email*");
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should create new user when user does not exist")]
    public async Task AuthenticateWithGoogle_NewUser_CreatesUser()
    {
        // Arrange
        var email = "newuser@gmail.com";
        var googleId = "google-id-123";
        var firstName = "John";
        var lastName = "Doe";
        var picture = "https://avatar.url";

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, googleId),
            new Claim(ClaimTypes.GivenName, firstName),
            new Claim(ClaimTypes.Surname, lastName),
            new Claim("picture", picture)
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        _mockUserManager.Setup(x => x.GetLoginsAsync(It.IsAny<User>()))
            .ReturnsAsync(new List<UserLoginInfo>());
        _mockUserManager.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync((User)null);
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddLoginAsync(It.IsAny<User>(), It.IsAny<UserLoginInfo>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(true);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns("refresh-token");

        // Act
        await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        _mockUserManager.Verify(x => x.CreateAsync(It.Is<User>(u =>
            u.Email == email &&
            u.UserName == email &&
            u.FirstName == firstName &&
            u.LastName == lastName &&
            u.ProfilePicture == picture)), Times.Once);
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should add Google login to existing user")]
    public async Task AuthenticateWithGoogle_ExistingUser_AddsGoogleLogin()
    {
        // Arrange
        var email = "existinguser@gmail.com";
        var googleId = "google-id-456";
        var user = _userFaker.Generate();
        user.Email = email;

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, googleId),
            new Claim(ClaimTypes.GivenName, "Jane"),
            new Claim(ClaimTypes.Surname, "Smith")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        _mockUserManager.Setup(x => x.GetLoginsAsync(user))
            .ReturnsAsync(new List<UserLoginInfo>());
        _mockUserManager.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.AddLoginAsync(user, It.IsAny<UserLoginInfo>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns("refresh-token");

        // Act
        await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        _mockUserManager.Verify(x => x.AddLoginAsync(user, It.Is<UserLoginInfo>(info =>
            info.LoginProvider == "Google" &&
            info.ProviderKey == googleId)), Times.Once);
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should generate and write refresh token cookie")]
    public async Task AuthenticateWithGoogle_ValidClaims_GeneratesAndWritesRefreshToken()
    {
        // Arrange
        var email = "user@gmail.com";
        var refreshToken = "new-refresh-token";
        var user = _userFaker.Generate();
        user.Email = email;

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, "google-id-789")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        _mockUserManager.Setup(x => x.GetLoginsAsync(user))
            .ReturnsAsync(new List<UserLoginInfo>());
        _mockUserManager.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.AddLoginAsync(user, It.IsAny<UserLoginInfo>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns(refreshToken);

        // Act
        await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        _mockJwtHandler.Verify(x => x.GenerateRefreshToken(), Times.Once);
        _mockJwtHandler.Verify(x => x.WriteRefreshTokenCookie(refreshToken), Times.Once);
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should throw ExternalLoginException when AddLogin fails")]
    public async Task AuthenticateWithGoogle_AddLoginFails_ThrowsExternalLoginException()
    {
        // Arrange
        var email = "user@gmail.com";
        var user = _userFaker.Generate();
        user.Email = email;
        var identityErrors = new[]
        {
            new IdentityError { Code = "LoginError", Description = "Login failed" }
        };

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, "google-id-999")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        _mockUserManager.Setup(x => x.GetLoginsAsync(user))
            .ReturnsAsync(new List<UserLoginInfo>());
        _mockUserManager.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync(user);
        _mockUserManager.Setup(x => x.AddLoginAsync(user, It.IsAny<UserLoginInfo>()))
            .ReturnsAsync(IdentityResult.Failed(identityErrors));

        // Act
        var act = async () => await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        await act.Should().ThrowAsync<ExternalLoginException>()
            .WithMessage("*Google*");
    }

    [Fact(DisplayName = "AuthenticateWithGoogle should assign User role to new Google user")]
    public async Task AuthenticateWithGoogle_NewUser_AssignsUserRole()
    {
        // Arrange
        var email = "newgoogleuser@gmail.com";
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, "google-id-111")
        };
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));

        _mockUserManager.Setup(x => x.GetLoginsAsync(It.IsAny<User>()))
            .ReturnsAsync(new List<UserLoginInfo>());
        _mockUserManager.Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync((User)null);
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockUserManager.Setup(x => x.AddLoginAsync(It.IsAny<User>(), It.IsAny<UserLoginInfo>()))
            .ReturnsAsync(IdentityResult.Success);
        _mockRoleManager.Setup(x => x.RoleExistsAsync("User")).ReturnsAsync(true);
        _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);
        _mockJwtHandler.Setup(x => x.GenerateRefreshToken()).Returns("refresh-token");

        // Act
        await _authService.AuthenticateWithGoogle(claimsPrincipal);

        // Assert
        _mockUserManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), "User"), Times.Once);
    }

    #endregion
}
