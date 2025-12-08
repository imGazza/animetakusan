using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entities;
using AnimeTakusan.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.Infrastructure.Authentication;

public class UserRepository : IUserRepository
{
    private readonly BaseContext _context;

    public UserRepository(BaseContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByRefreshToken(string refreshToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        return user;
    }
}
