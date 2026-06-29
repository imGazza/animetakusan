using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Domain;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMalSyncService
{
    Task SyncAsync(MalSyncActionMessage message, string accessToken);
    Task ReplayAllAsync(MalUser malUser);
}
