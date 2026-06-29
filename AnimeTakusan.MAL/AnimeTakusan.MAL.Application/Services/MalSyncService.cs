using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain;

namespace AnimeTakusan.MAL.Application.Services;

public class MalSyncService : IMalSyncService
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly IMalSyncClient _malSyncClient;
    private readonly IMalReplayMessageRepository _malReplayMessageRepository;

    public MalSyncService(IMalSyncClient malSyncClient, IMalReplayMessageRepository malReplayMessageRepository)
    {
        _malSyncClient = malSyncClient;
        _malReplayMessageRepository = malReplayMessageRepository;
    }

    public Task SyncAsync(MalSyncActionMessage message, string accessToken)
        => _malSyncClient.SyncAnimeAsync(message, accessToken);

    public async Task ReplayAllAsync(MalUser malUser)
    {
        var pending = await _malReplayMessageRepository.GetPendingReplaysByMalUserIdAsync(malUser.MalUserId);
        foreach (var entry in pending)
        {
            try
            {
                var message = JsonSerializer.Deserialize<MalSyncActionMessage>(entry.RawMessage, _jsonOptions);
                if (message != null)
                    await SyncAsync(message, malUser.AccessToken);

                await _malReplayMessageRepository.DeleteAsync(entry);
            }
            catch
            {
                // Log Warning for failed replay, but don't throw to avoid blocking other replays
                continue;
            }
        }
    }
}
