using AnimeTakusan.MAL.Domain;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMalUserRepository
{
    Task UpsertAsync(MalUser user);
    Task<MalUser> GetByMalUserIdAsync(int malUserId);
    Task UpdateTokens(MalUser user);
}
