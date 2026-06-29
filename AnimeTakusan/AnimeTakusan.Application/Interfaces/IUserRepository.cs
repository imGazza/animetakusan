using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Interfaces;

public interface IUserRepository
{
    Task<User> GetUserByRefreshToken(string refreshToken);
    Task UpsertAniListUserAsync(AniListUser aniListUser);
    Task LinkMalUserAsync(MyAnimeListUser malUser);
    Task<MyAnimeListUser> GetMalUserByUserId(Guid userId);
    Task UpdateMalUserAsync(MyAnimeListUser malUser);
}
