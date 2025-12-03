using System.Security.Claims;
using System.Threading.Tasks;
using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entitities;
using AnimeTakusan.Domain.Exceptions;
using AnimeTakusan.Infrastructure.Exceptions;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.Application.Services;

public class AuthService : IAuthService, IInjectable
{
    private readonly ILogger<AuthService> _logger;
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;
    private readonly IJwtHandler _jwtHandler;

    public AuthService(IUserRepository userRepository, IJwtHandler jwtHandler, ILogger<AuthService> logger, UserManager<User> userManager)
    {
        _logger = logger;
        _userRepository = userRepository;
        _jwtHandler = jwtHandler;
        _userManager = userManager;
    }

    /// <summary>
    /// Generates a generic guest access token for not signed-up users.
    /// Generates an authenticated user access token otherwise.
    /// </summary>
    /// <returns>The access token and a representation of the user, if any.</returns>
    public async Task<TokenResponse> Token()
    {
        var refreshToken = _jwtHandler.GetRefreshToken();
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            return new TokenResponse { AccessToken = _jwtHandler.GenerateGuestAccessToken() };
        }

        var user = await _userRepository.GetUserByRefreshToken(refreshToken);
        
        if (user == null || !hasValidRefreshToken(user))
        {
            return new TokenResponse { AccessToken = _jwtHandler.GenerateGuestAccessToken() };
        }

        var response = new TokenResponse {
            User = user.Adapt<UserInfo>(), 
            AccessToken = _jwtHandler.GenerateUserAccessToken(refreshToken) 
        };
        _logger.LogInformation($"Generated access token for user {user.Email}.");
        return response;
    }

    private bool hasValidRefreshToken(User user)
    {
        if(user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            _logger.LogError($"Refresh token has expired for user {user.Email}.");
            //throw new InvalidRefreshTokenException($"Refresh token {refreshToken} has expired.");
            return false;
        }
        return true;
    }

    public async Task SignUp(RegisterRequest registerRequest)
    {
        var user = await _userManager.FindByEmailAsync(registerRequest.Email);

        if(user != null)
        {
            throw new UserAlreadySignedUpException(registerRequest.Email);
        }

        user = new User
        {
            UserName = registerRequest.Username,
            Email = registerRequest.Email,
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            ProfilePicture = registerRequest.ProfilePicture
        };
        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, registerRequest.Password);
        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded)
        {
            throw new RegistrationFailedException(registerRequest.Email);
        }

        var refreshToken = _jwtHandler.GenerateRefreshToken();
        _jwtHandler.WriteRefreshTokenCookie(refreshToken);
    }

    public async Task AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal)
    {
        ValidateGoogleUserData(claimsPrincipal, out string email);

        var user = await _userManager.FindByEmailAsync(email);
        if(user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                Username = email,
                FirstName = claimsPrincipal.FindFirst(ClaimTypes.GivenName)?.Value ?? string.Empty,
                LastName = claimsPrincipal.FindFirst(ClaimTypes.Surname)?.Value ?? string.Empty,
                ProfilePicture = claimsPrincipal.FindFirst("picture")?.Value ?? string.Empty
            };
            await _userManager.CreateAsync(user);
        }
        
        await AddGoogleLogin(claimsPrincipal, user);

        var refreshToken = _jwtHandler.GenerateRefreshToken();
        _jwtHandler.WriteRefreshTokenCookie(refreshToken);
    }

    private void ValidateGoogleUserData(ClaimsPrincipal claimsPrincipal, out string email)
    {
        if(claimsPrincipal == null)
        {
            throw new ExternalLoginException("Google", "ClaimsPrincipal is missing.");
        }

        var emailClaim = claimsPrincipal.FindFirst(ClaimTypes.Email);
        if(emailClaim == null || string.IsNullOrWhiteSpace(emailClaim.Value))
        {
            throw new ExternalLoginException("Google", "Email claim is missing.");
        }

        email = emailClaim.Value;
    }

    private async Task AddGoogleLogin(ClaimsPrincipal claimsPrincipal, User user)
    {
        var info = new UserLoginInfo("Google",
            claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty,
            "Google");

        var loginResult = await _userManager.AddLoginAsync(user, info);

        if (!loginResult.Succeeded)
        {
            throw new ExternalLoginException("Google", $"Failed to add Google login for user {user.Email}. {string.Join(", ",
                    loginResult.Errors.Select(x => x.Description))}");
        }
    }
}
