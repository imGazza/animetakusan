
namespace AnimeTakusan.Core.Authentication;

public interface IJwtService
{
    string GenerateAccessToken();
    string GenerateRefreshToken();
}

public class JwtService : IJwtService
{
    public string GenerateAccessToken()
    {
        throw new NotImplementedException();
    }

    public string GenerateRefreshToken()
    {
        throw new NotImplementedException();
    }


}
