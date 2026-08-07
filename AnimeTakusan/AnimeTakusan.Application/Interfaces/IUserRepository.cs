using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Interfaces;

public interface IUserRepository
{
    Task<UserSession> GetUserSessionByRefreshToken(string refreshToken);
    Task<AniListUser> GetAniListUserByIdAsync(Guid userId);
    Task UpsertAniListUserAsync(AniListUser aniListUser);
    Task UpdateAniListUserInfoAsync(int aniListUserId, string aniListUsername, string aniListAvatar);
    Task LinkMalUserAsync(MyAnimeListUser malUser);
    Task<MyAnimeListUser> GetMalUserByUserId(Guid userId);
    Task UpdateMalUserAsync(MyAnimeListUser malUser);
    Task CreateUserSession(UserSession userSession);
    Task UpdateUserSession(int userSessionId, string refreshToken);
    Task DeleteUserSessionByRefreshToken(string refreshToken);
}
