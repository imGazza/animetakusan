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

    public async Task<UserSession?> GetUserSessionByRefreshToken(string refreshToken)
    {
        var userSession = await _context.UserSessions
            .Include(u => u.User)
            .Include(u => u.User.AniListUser)
            .Include(u => u.User.MyAnimeListUser)
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken && u.RefreshTokenExpiryTime > DateTime.UtcNow);
        return userSession;
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
        var existingAniListUser = await _context.AniListUsers.FirstOrDefaultAsync(a => a.UserId == aniListUser.UserId);

        if (existingAniListUser != null)
        {
            existingAniListUser.AniListUserId = aniListUser.AniListUserId;
            existingAniListUser.AccessToken = aniListUser.AccessToken;
            existingAniListUser.AccessTokenExpiry = aniListUser.AccessTokenExpiry;
            existingAniListUser.UpdatedAt = DateTime.UtcNow;

            _context.AniListUsers.Update(existingAniListUser);
            await _context.SaveChangesAsync();
            return;
        }

        await _context.AniListUsers.AddAsync(aniListUser);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAniListUserInfoAsync(int aniListUserId, string aniListUsername, string aniListAvatar)
    {
        await _context.AniListUsers.Where(a => a.AniListUserId == aniListUserId).ExecuteUpdateAsync(s => s
            .SetProperty(a => a.UpdatedAt, DateTime.UtcNow)
            .SetProperty(a => a.AniListUsername, aniListUsername)
            .SetProperty(a => a.AniListAvatar, aniListAvatar));
    }

    public async Task LinkMalUserAsync(MyAnimeListUser malUser)
    {
        await _context.MyAnimeListUsers.AddAsync(malUser);
        await _context.SaveChangesAsync();
    }

    public async Task<MyAnimeListUser?> GetMalUserByUserId(Guid userId)
    {
        return await _context.MyAnimeListUsers.FirstOrDefaultAsync(m => m.UserId == userId);
    }

    public async Task UpdateMalUserAsync(MyAnimeListUser malUser)
    {
        _context.MyAnimeListUsers.Update(malUser);
        await _context.SaveChangesAsync();
    }

    public async Task CreateUserSession(UserSession userSession)
    {
        await _context.UserSessions.AddAsync(userSession);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateUserSession(int userSessionId, string refreshToken)
    {
        await _context.UserSessions.Where(a => a.Id == userSessionId).ExecuteUpdateAsync(s => s
            .SetProperty(a => a.UpdatedAt, DateTime.UtcNow)
            .SetProperty(a => a.RefreshToken, refreshToken)
            .SetProperty(a => a.RefreshTokenExpiryTime, DateTime.UtcNow.AddDays(7)));
    }

    public async Task DeleteUserSessionByRefreshToken(string refreshToken)
    {
        await _context.UserSessions.Where(us => us.RefreshToken == refreshToken).ExecuteDeleteAsync();
    }
}
