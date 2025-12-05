using System.Security.Claims;
using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Application.DTOs.Authentication.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAuthService
{
    Task<TokenResponse> Token();
    Task<TokenResponse> Login(LoginRequest loginRequest);
    Task SignUp(RegisterRequest registerRequest);
    Task AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal);
}
