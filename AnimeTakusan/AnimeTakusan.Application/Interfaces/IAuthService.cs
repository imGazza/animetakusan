using System.Security.Claims;

namespace AnimeTakusan.Application.Interfaces;

public interface IAuthService
{
    string Token();
    void AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal);
}
