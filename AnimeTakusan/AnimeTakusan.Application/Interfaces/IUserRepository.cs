using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Interfaces;

public interface IUserRepository
{
    Task<User> GetUserByRefreshToken(string refreshToken);
}
