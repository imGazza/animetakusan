using AnimeTakusan.Domain.Entitities;

namespace AnimeTakusan.Application.Interfaces;

public interface IUserRepository
{
    User? GetUserByEmail(string email);
    void CreateUser(User user);
}
