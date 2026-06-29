using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain;

namespace AnimeTakusan.MAL.Application.Handlers;

public class MalSyncActionHandler : IMessageHandler
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly IMalAuthService _malAuthService;
    private readonly IMalUserRepository _malUserRepository;
    private readonly IMessagePublisher _messagePublisher;
    private readonly IMalReplayMessageRepository _malReplayMessageRepository;
    private readonly IMalSyncService _malSyncService;

    public MalSyncActionHandler(
        IMalAuthService malAuthService,
        IMalUserRepository malUserRepository,
        IMessagePublisher messagePublisher,
        IMalReplayMessageRepository malReplayMessageRepository,
        IMalSyncService malSyncService)
    {
        _malAuthService = malAuthService;
        _malUserRepository = malUserRepository;
        _messagePublisher = messagePublisher;
        _malReplayMessageRepository = malReplayMessageRepository;
        _malSyncService = malSyncService;
    }

    // Found out that Mal Access Token expires in 31 days (-5 as set in the DB) as the refresh token
    // So the refresh branch of the handler will never be hit
    // Leave it anyway for future proofing
    // The HandleExpiredUserAsync method will be hit only if the user doesn't log for 26 days and a full reauthentication is needed
    public async Task HandleMessageAsync(string message)
    {
        var (malSyncActionMessage, malUser) = await ValidateMessageAsync(message);

        // Authentication expired
        if (malUser.AccessTokenExpiresAt < DateTime.UtcNow && malUser.RefreshTokenExpiresAt < DateTime.UtcNow)
        {
            await HandleExpiredUserAsync(malUser, message);
            return;
        }

        var needsRefresh = malUser.AccessTokenExpiresAt < DateTime.UtcNow;
        var accessToken = needsRefresh
            ? await GetAccessTokenAsync(malUser, message)
            : malUser.AccessToken;

        await _malSyncService.SyncAsync(malSyncActionMessage, accessToken);

        // Replay all the previously failed messages for the user if the access token was refreshed
        if (needsRefresh)
            await _malSyncService.ReplayAllAsync(malUser);
    }

    private async Task<(MalSyncActionMessage, MalUser)> ValidateMessageAsync(string message)
    {
        var malSyncActionMessage = JsonSerializer.Deserialize<MalSyncActionMessage>(message, _jsonOptions);

        if (malSyncActionMessage == null)
            throw new ArgumentException("Invalid message format", nameof(message));

        var malUser = await _malUserRepository.GetByMalUserIdAsync(malSyncActionMessage.MalUserId);
        if (malUser == null)
            throw new ArgumentException("MAL user not found", nameof(malSyncActionMessage.MalUserId));

        return (malSyncActionMessage, malUser);
    }

    private async Task HandleExpiredUserAsync(MalUser malUser, string message)
    {
        await _malReplayMessageRepository.AddAsync(new MalReplayMessage
        {
            MalUserId = malUser.MalUserId,
            RawMessage = message,
            CreatedAt = DateTime.UtcNow
        });

        var expiredMessage = new MalAuthEventMessage(malUser.UserId, malUser.MalUserId, malUser.RefreshTokenExpiresAt, Status.Expired);
        await _messagePublisher.PublishAsync(expiredMessage);
    }

    private async Task<string> GetAccessTokenAsync(MalUser malUser, string message)
    {
        try
        {
            return await _malAuthService.RefreshToken(malUser);
        }
        catch (Exception)
        {
            // Read from DB again in case another db context instance already refreshed the token
            malUser = await _malUserRepository.GetByMalUserIdAsync(malUser.MalUserId);

            if (malUser.AccessTokenExpiresAt < DateTime.UtcNow)
                await HandleExpiredUserAsync(malUser, message);

            throw;
        }
    }
}
