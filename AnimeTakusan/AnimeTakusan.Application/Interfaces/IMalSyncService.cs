using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.Messages;
namespace AnimeTakusan.Application.Interfaces;

public interface IMalSyncService
{
    Task PublishMalSyncAction(int malUserId, AnimeEntryUpsertRequest animeEntryUpsertRequest, SyncAction action);
}
