using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Application.Utility;
using AnimeTakusan.MAL.Domain;
using AnimeTakusan.MAL.Domain.Exception.SyncActionExceptions;
using Microsoft.Extensions.Logging;

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
    private readonly ILogger<MalSyncActionHandler> _logger;

    public MalSyncActionHandler(
        IMalAuthService malAuthService,
        IMalUserRepository malUserRepository,
        IMessagePublisher messagePublisher,
        IMalReplayMessageRepository malReplayMessageRepository,
        IMalSyncService malSyncService,
        ILogger<MalSyncActionHandler> logger)
    {
        _malAuthService = malAuthService;
        _malUserRepository = malUserRepository;
        _messagePublisher = messagePublisher;
        _malReplayMessageRepository = malReplayMessageRepository;
        _malSyncService = malSyncService;
        _logger = logger;
    }
    
    // The HandleExpiredUserAsync method will be hit only if the user doesn't log for 26 days and a full reauthentication is needed
    public async Task HandleMessageAsync(string message, string messageId)
    {
        using var scope = _logger.ConsumerLoggerScope(messageId, message);

        _logger.LogDebug("Processing message {MessageId}: {Message}", messageId, message);
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

        _logger.LogDebug("Successfully processed message {MessageId}", messageId);
    }

    private async Task<(MalSyncActionMessage, MalUser)> ValidateMessageAsync(string message)
    {
        var malSyncActionMessage = JsonSerializer.Deserialize<MalSyncActionMessage>(message, _jsonOptions);

        if (malSyncActionMessage == null)
            throw new SyncActionException($"Invalid message format: {message}");

        var malUser = await _malUserRepository.GetByMalUserIdAsync(malSyncActionMessage.MalUserId);
        if (malUser == null)
            throw new SyncActionException($"MAL user {malSyncActionMessage.MalUserId} not found");

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

        var expiredMessage = new MalAuthEventMessage(malUser.UserId, malUser.MalUserId, malUser.AccessTokenExpiresAt, Status.Expired);
        await _messagePublisher.PublishAsync(expiredMessage);
        _logger.LogDebug("Published expired auth event message for user {MalUserId}", malUser.MalUserId);
    }

    private async Task<string> GetAccessTokenAsync(MalUser malUser, string message)
    {
        try
        {
            var refreshedToken = await _malAuthService.RefreshToken(malUser);
            _logger.LogDebug("Refreshed access token for user {MalUserId}", malUser.MalUserId);
            return refreshedToken;
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
