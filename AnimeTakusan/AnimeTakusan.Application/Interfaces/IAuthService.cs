using System.Security.Claims;

namespace AnimeTakusan.Application.Interfaces;

public interface IAuthService
{
    void AuthenticateWithGoogle(ClaimsPrincipal claimsPrincipal);
}
