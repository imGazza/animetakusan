using System.Runtime.InteropServices;
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
        var user = await _context.Users
            .Include(u => u.AniListUser)
            .Include(u => u.MyAnimeListUser)
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        return user;
    }

    public async Task<AniListUser?> GetAniListUserByIdAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.AniListUser)
            .Include(u => u.MyAnimeListUser)
            .FirstOrDefaultAsync(u => u.Id == userId && u.AniListUser != null);
        return user?.AniListUser;
    }

    public async Task UpsertAniListUserAsync(AniListUser aniListUser)
    {
        var existingAniListUser = await _context.Set<AniListUser>().FirstOrDefaultAsync(a => a.UserId == aniListUser.UserId);

        if (existingAniListUser != null)
        {
            existingAniListUser.AniListUserId = aniListUser.AniListUserId;
            existingAniListUser.AccessToken = aniListUser.AccessToken;
            existingAniListUser.AccessTokenExpiry = aniListUser.AccessTokenExpiry;
            existingAniListUser.UpdatedAt = DateTime.UtcNow;

            _context.Set<AniListUser>().Update(existingAniListUser);
            await _context.SaveChangesAsync();
            return;
        }

        await _context.Set<AniListUser>().AddAsync(aniListUser);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAniListUserInfoAsync(int aniListUserId, string aniListUsername, string aniListAvatar)
    {
        await _context.Set<AniListUser>().Where(a => a.AniListUserId == aniListUserId).ExecuteUpdateAsync(s => s
            .SetProperty(a => a.UpdatedAt, DateTime.UtcNow)
            .SetProperty(a => a.AniListUsername, aniListUsername)
            .SetProperty(a => a.AniListAvatar, aniListAvatar));
    }

    public async Task LinkMalUserAsync(MyAnimeListUser malUser)
    {
        await _context.Set<MyAnimeListUser>().AddAsync(malUser);
        await _context.SaveChangesAsync();
    }

    public async Task<MyAnimeListUser?> GetMalUserByUserId(Guid userId)
    {
        return await _context.Set<MyAnimeListUser>().FirstOrDefaultAsync(m => m.UserId == userId);
    }

    public async Task UpdateMalUserAsync(MyAnimeListUser malUser)
    {
        _context.Set<MyAnimeListUser>().Update(malUser);
        await _context.SaveChangesAsync();
    }
}
