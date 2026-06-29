using AnimeTakusan.MAL.Domain;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMalAuthService
{
    Task AuthenticateMalUser(string code, string codeVerifier, string state);
    Task<string> RefreshToken(MalUser malUser);
}
