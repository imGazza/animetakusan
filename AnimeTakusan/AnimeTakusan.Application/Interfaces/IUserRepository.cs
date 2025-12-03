using AnimeTakusan.Domain.Entitities;

namespace AnimeTakusan.Application.Interfaces;

public interface IUserRepository
{
    Task<User> GetUserByRefreshToken(string refreshToken);
}
