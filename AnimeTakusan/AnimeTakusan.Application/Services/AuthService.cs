using System.Security.Claims;
using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entities;
using AnimeTakusan.Domain.Exceptions;
using FluentValidation;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.Application.Services;

public class AuthService : IAuthService, IInjectable
{
    private readonly ILogger<AuthService> _logger;
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly IJwtHandler _jwtHandler;
    private readonly IValidator<LoginRequest> _loginRequestValidator;
    private readonly IValidator<RegisterRequest> _registerRequestValidator;

    public AuthService(
        IUserRepository userRepository, 
        IJwtHandler jwtHandler, 
        ILogger<AuthService> logger, 
        UserManager<User> userManager, 
        RoleManager<IdentityRole<Guid>> roleManager,
        IValidator<LoginRequest> loginRequestValidator,
        IValidator<RegisterRequest> registerRequestValidator)
    {
        _logger = logger;
        _userRepository = userRepository;
        _jwtHandler = jwtHandler;
        _userManager = userManager;
        _roleManager = roleManager;
        _loginRequestValidator = loginRequestValidator;
        _registerRequestValidator = registerRequestValidator;
    }

    /// <summary>
    /// Generates a generic guest access token for not signed-up users.
    /// Generates an authenticated user access token otherwise and create a new refresh token.
    /// </summary>
    /// <returns>The access token and a representation of the user, if any.</returns>
    public async Task<TokenResponse> Token()
    {
        var refreshToken = _jwtHandler.GetRefreshToken();
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            var (guestToken, guestExpiresAt) = _jwtHandler.GenerateGuestAccessToken();
            return new TokenResponse { AccessToken = guestToken, ExpiresAt = guestExpiresAt };
        }

        var user = await _userRepository.GetUserByRefreshToken(refreshToken);
        
        if (user == null || !HasValidRefreshToken(user))
        {
            var (guestToken, guestExpiresAt) = _jwtHandler.GenerateGuestAccessToken();
            return new TokenResponse { AccessToken = guestToken, ExpiresAt = guestExpiresAt };
        }

        user.RefreshToken = _jwtHandler.GenerateRefreshToken();
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);
        _jwtHandler.WriteRefreshTokenCookie(user.RefreshToken);

        var userRoles = await _userManager.GetRolesAsync(user);

        var (accessToken, expiresAt) = _jwtHandler.GenerateUserAccessToken(refreshToken, user, userRoles);
        var response = new TokenResponse {
            AccessToken = accessToken,
            ExpiresAt = expiresAt
        };
        _logger.LogInformation($"Generated access token for user {user.Email}.");
        return response;
    }

    /// <summary>
    /// Retrieves the user information of the logged user.
    /// </summary>
    /// <returns>
    /// Returns the logged user's information, if any.
    /// Returns an emty object for guest users.
    /// </returns>
    public async Task<UserInfo> GetUserInfo()
    {
        var refreshToken = _jwtHandler.GetRefreshToken();
        if (string.IsNullOrEmpty(refreshToken))
        {
            return null;
        }

        var user = await _userRepository.GetUserByRefreshToken(refreshToken);
        return user?.Adapt<UserInfo>();
    }

    /// <summary>
    /// Authenticate a user with the provided credentials.
    /// </summary>
    /// <param name="loginRequest">User credentials </param>
    /// <returns>The access token and a representation of the user.</returns>
    /// <exception cref="LoginFailedException">Invalid email or password</exception>
    public async Task Login(LoginRequest loginRequest)
    {
        _loginRequestValidator.ValidateAndThrow(loginRequest);

        var user = await _userManager.FindByEmailAsync(loginRequest.Email);
        if(user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
        {
            throw new LoginFailedException();
        }
        
        user.RefreshToken = _jwtHandler.GenerateRefreshToken();
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);
        _jwtHandler.WriteRefreshTokenCookie(user.RefreshToken);

        _logger.LogInformation($"User {user.Email} logged in.");
    }

    private bool HasValidRefreshToken(User user)
    {
        if(user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            _logger.LogWarning($"Refresh token has expired for user {user.Email}.");
            return false;
        }
        return true;
    }

    /// <summary>
    /// Logout the current user by invalidating the refresh token.
    /// </summary>
    public async Task Logout()
    {
        var refreshToken = _jwtHandler.GetRefreshToken();
        if (string.IsNullOrEmpty(refreshToken))
        {
            return;
        }

        var user = await _userRepository.GetUserByRefreshToken(refreshToken);
        if (user == null)
        {
            return;
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _userManager.UpdateAsync(user);
        _jwtHandler.DeleteRefreshTokenCookie();
        _logger.LogInformation($"User {user.Email} logged out.");
    }

    /// <summary>
    /// Register a new user to the app with the provided data.
    /// </summary>
    /// <param name="registerRequest">The registration request containing user details</param>
    /// <exception cref="UserAlreadySignedUpException">The user is already signed-up with this email</exception>
    /// <exception cref="RegistrationFailedException">The registration process failed</exception>
    public async Task SignUp(RegisterRequest registerRequest)
    {
        _registerRequestValidator.ValidateAndThrow(registerRequest);
        
        var user = await _userManager.FindByEmailAsync(registerRequest.Email);

        if(user != null)
        {
            throw new UserAlreadySignedUpException(registerRequest.Email);
        }

        user = new User
        {
            UserName = registerRequest.Username,
            Email = registerRequest.Email
        };
        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, registerRequest.Password);
        var result = await _userManager.CreateAsync(user);

        if (!result.Succeeded)
        {
            throw new RegistrationFailedException(registerRequest.Email);
        }

        await AddRoleToUser("Guest", user);
        await AddRoleToUser("User", user);
    }    

    /// <summary>
    /// Authenticate or register a user using Google external login.
    /// </summary>
    /// <param name="claimsPrincipal">Google claims principal</param>
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
                UserName = email,
                FirstName = claimsPrincipal.FindFirst(ClaimTypes.GivenName)?.Value ?? string.Empty,
                LastName = claimsPrincipal.FindFirst(ClaimTypes.Surname)?.Value ?? string.Empty,
                ProfilePicture = claimsPrincipal.FindFirst("picture")?.Value ?? string.Empty,
            };
            await _userManager.CreateAsync(user);

            await AddRoleToUser("User", user);
        }
        
        await AddGoogleLogin(claimsPrincipal, user);

        var refreshToken = _jwtHandler.GenerateRefreshToken();
        _jwtHandler.WriteRefreshTokenCookie(refreshToken);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);
        _logger.LogInformation($"User {user.Email} logged in with Google.");
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
        // Add login only if not already added
        var userGoogleLogin = await _userManager.GetLoginsAsync(user);
        if(userGoogleLogin.SingleOrDefault(x => x.LoginProvider == "Google") != null)
        {
            return;
        }

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

    private async Task AddRoleToUser(string role, User user)
    {
        if (!await _roleManager.RoleExistsAsync(role))
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole<Guid>(role));
            if (!roleResult.Succeeded)
            {
                throw new RoleCreationException(role);
            }
        }

        var addRoleResult = await _userManager.AddToRoleAsync(user, role);
        if (!addRoleResult.Succeeded)
        {
            throw new RoleAssignmentException(role, user.Email);
        }
    }

}
