using System.Security.Claims;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entitities;
using AnimeTakusan.Infrastructure.Exceptions;

namespace AnimeTakusan.Application.Services;

public class AuthService : IAuthService, IInjectable
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtHandler _jwtHandler;

    public AuthService(IUserRepository userRepository, IJwtHandler jwtHandler)
    {
        _userRepository = userRepository;
        _jwtHandler = jwtHandler    ;
    }

    // TODO: Return a more complex object with some user info
    public string Token()
    {        
        string refreshToken = _jwtHandler.GetRefreshToken();
        string accessToken;
        // TODO: Validate refresh token against database

        if(!string.IsNullOrEmpty(refreshToken))
        {
            accessToken = _jwtHandler.GenerateAuthenticatedAccessToken(refreshToken);
        }
        else
        {
            accessToken = _jwtHandler.GenerateGuestAccessToken();
        }

        return accessToken;
    }

    public void AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal)
    {
        ValidateUserData(claimsPrincipal, out string email);

        var user = _userRepository.GetUserByEmail(email);
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
            _userRepository.CreateUser(user);
        }

        var refreshToken = _jwtHandler.GenerateRefreshToken();
        
        // Handle Add Login when Identity implemented

        _jwtHandler.WriteRefreshTokenCookie(refreshToken);
    }

    private void ValidateUserData(ClaimsPrincipal claimsPrincipal, out string email)
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
}
