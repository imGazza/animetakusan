using System;
using AnimeTakusan.MAL.Application.DTOs.Messages;

namespace AnimeTakusan.MAL.Application.Interfaces;

public interface IMalSyncClient
{
    Task SyncAnimeAsync(MalSyncActionMessage message, string accessToken);
}
