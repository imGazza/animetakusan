using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.MAL.Infrastructure.Repositories;

public class MalReplayMessageRepository : IMalReplayMessageRepository
{
    private readonly MalContext _malContext;

    public MalReplayMessageRepository(MalContext malContext)
    {
        _malContext = malContext;
    }

    public async Task AddAsync(MalReplayMessage malReplayMessage)
    {
        await _malContext.MalReplayMessages.AddAsync(malReplayMessage);
        await _malContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(MalReplayMessage malReplayMessage)
    {
        _malContext.MalReplayMessages.Remove(malReplayMessage);
        await _malContext.SaveChangesAsync();
    }

    public async Task<List<MalReplayMessage>> GetPendingReplaysByMalUserIdAsync(int malUserId)
    {
        return await _malContext.MalReplayMessages
            .Where(m => m.MalUserId == malUserId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }
}
