using AnimeTakusan.MAL.Domain;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMalReplayMessageRepository
{
    Task AddAsync(MalReplayMessage malReplayMessage);
    Task DeleteAsync(MalReplayMessage malReplayMessage);
    Task<List<MalReplayMessage>> GetPendingReplaysByMalUserIdAsync(int malUserId);
}
