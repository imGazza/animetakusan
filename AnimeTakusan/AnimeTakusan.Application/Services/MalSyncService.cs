using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.Messages;
using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.Application.Services;

public class MalSyncService : IMalSyncService, IInjectable
{
    private readonly IMessagePublisher _messagePublisher;

    public MalSyncService(IMessagePublisher messagePublisher)
    {
        _messagePublisher = messagePublisher;
    }

    public async Task PublishMalSyncAction(int malUserId, AnimeEntryUpsertRequest animeEntryUpsertRequest, SyncAction action)
    {
        var message = new MalSyncActionMessage
        {
            Action = action,
            MalUserId = malUserId,
            AnimeId = animeEntryUpsertRequest.MalId,
            Status = animeEntryUpsertRequest.Status,
            Score = animeEntryUpsertRequest.Score,
            Progress = animeEntryUpsertRequest.Progress,
            CompletedAt = animeEntryUpsertRequest.CompletedAt,
            StartedAt = animeEntryUpsertRequest.StartedAt
        };
        await _messagePublisher.PublishAsync(message);
    }
}
