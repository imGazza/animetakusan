using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.MAL.Application.Services;

public class MalSyncService : IMalSyncService
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly IMalSyncClient _malSyncClient;
    private readonly IMalReplayMessageRepository _malReplayMessageRepository;
    private readonly ILogger<MalSyncService> _logger;

    public MalSyncService(IMalSyncClient malSyncClient, IMalReplayMessageRepository malReplayMessageRepository, ILogger<MalSyncService> logger)
    {
        _malSyncClient = malSyncClient;
        _malReplayMessageRepository = malReplayMessageRepository;
        _logger = logger;
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
                _logger.LogWarning("Failed to replay message {MessageId} for MAL user {MalUserId}. Skipped.", entry.Id, malUser.MalUserId);
                continue;
            }
        }

        _logger.LogDebug("Replayed {Count} messages for MAL user {MalUserId}.", pending.Count, malUser.MalUserId);
    }
}
