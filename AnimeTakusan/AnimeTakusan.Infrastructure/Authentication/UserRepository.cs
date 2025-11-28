using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entitities;
using AnimeTakusan.Infrastructure.Contexts;

namespace AnimeTakusan.Infrastructure.Authentication;

public class UserRepository : IUserRepository
{
    private readonly BaseContext _context;

    public UserRepository(BaseContext context)
    {
        _context = context;
    }

    public User? GetUserByEmail(string email)
    {
        return _context.Users.SingleOrDefault(u => u.Email == email);
    }

    public void CreateUser(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }
}
