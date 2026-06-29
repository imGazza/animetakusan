using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.MAL.Infrastructure.Repositories;

public class MalUserRepository : IMalUserRepository
{
    private readonly MalContext _malContext;

    public MalUserRepository(MalContext malContext)
    {
        _malContext = malContext;
    }

    public async Task UpsertAsync(MalUser user)
    {
        var malUser = _malContext.MalUsers.FirstOrDefault(u => u.MalUserId == user.MalUserId);
        if (malUser != null)
        {
            malUser.AccessToken = user.AccessToken;
            malUser.RefreshToken = user.RefreshToken;
            malUser.AccessTokenExpiresAt = user.AccessTokenExpiresAt;
            malUser.RefreshTokenExpiresAt = user.RefreshTokenExpiresAt;
            malUser.UpdatedAt = DateTime.UtcNow;

            _malContext.MalUsers.Update(malUser);
            await _malContext.SaveChangesAsync();
            return;
        }

        await _malContext.MalUsers.AddAsync(user);
        await _malContext.SaveChangesAsync();
    }

    public async Task<MalUser?> GetByMalUserIdAsync(int malUserId)
    {
        return await _malContext.MalUsers.FirstOrDefaultAsync(u => u.MalUserId == malUserId);
    }

    public async Task UpdateTokens(MalUser user)
    {
        _malContext.MalUsers.Update(user);
        await _malContext.SaveChangesAsync();
    }

    public async Task<MalUser?> GetByUserIdAsync(Guid userId)
    {
        return await _malContext.MalUsers.FirstOrDefaultAsync(u => u.UserId == userId);
    }
}
