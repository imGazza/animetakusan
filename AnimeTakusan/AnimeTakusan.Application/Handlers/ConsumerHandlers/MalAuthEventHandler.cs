using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.Application.DTOs.Messages;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;
using AnimeTakusan.Domain.Common;
using AnimeTakusan.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.Application.Handlers.ConsumerHandlers;

public class MalAuthEventHandler : IMessageHandler
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly IUserRepository _userRepository;
    private readonly ILogger<MalAuthEventHandler> _logger;

    public MalAuthEventHandler(IUserRepository userRepository, ILogger<MalAuthEventHandler> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task HandleMessageAsync(string message, string messageId)
    {
        using var scope = _logger.ConsumerLoggerScope(messageId, message);

        _logger.LogDebug("Processing message {MessageId}: {Message}", messageId, message);
        var malAuthEvent = JsonSerializer.Deserialize<MalAuthEventMessage>(message, _jsonOptions);
        if (malAuthEvent == null)
        {
            throw new ArgumentException("Invalid message format", nameof(message));
        }

        var malUser = await _userRepository.GetMalUserByUserId(malAuthEvent.UserId);

        switch (malAuthEvent.Status)
        {
            case Status.Linked:
                await LinkMalAccount(malAuthEvent, malUser);
                _logger.LogInformation("Linked MyAnimeList account for user ID: {UserId}", malAuthEvent.UserId);
                break;
            case Status.Refreshed:
                await RefreshMalAccount(malAuthEvent, malUser);
                _logger.LogInformation("Refreshed MyAnimeList account for user ID: {UserId}", malAuthEvent.UserId);
                break;
            case Status.Expired:
                await UnlinkMalAccount(malAuthEvent, malUser);
                _logger.LogInformation("Expired MyAnimeList account for user ID: {UserId}", malAuthEvent.UserId);
                break;
            default:
                throw new NotImplementedException("There is no behaviour for this status.");
        }

        _logger.LogDebug("Successfully processed message {MessageId}", messageId);
    }

    private async Task LinkMalAccount(MalAuthEventMessage malAuthEvent, MyAnimeListUser malUser)
    {        
        if(malUser is not null)
        {
            await RefreshMalAccount(malAuthEvent, malUser);
            return;
        }

        malUser = new MyAnimeListUser
        {
            UserId = malAuthEvent.UserId,
            MalUserId = malAuthEvent.MalUserId,
            RefreshTokenExpiry = malAuthEvent.RefreshTokenExpiresAt,
            Status = MyAnimeListLinkStatus.Linked
        };

        await _userRepository.LinkMalUserAsync(malUser);
    }

    private async Task RefreshMalAccount(MalAuthEventMessage malAuthEvent, MyAnimeListUser malUser)
    {
        if(malUser is null) throw new ArgumentException("MyAnimeList user not found for the given user ID.", nameof(malAuthEvent.UserId));

        malUser.RefreshTokenExpiry = malAuthEvent.RefreshTokenExpiresAt;
        malUser.Status = MyAnimeListLinkStatus.Linked;
        malUser.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateMalUserAsync(malUser);
    }

    private async Task UnlinkMalAccount(MalAuthEventMessage malAuthEvent, MyAnimeListUser malUser)
    {
        if(malUser is null) throw new ArgumentException("MyAnimeList user not found for the given user ID.", nameof(malAuthEvent.UserId));

        malUser.Status = MyAnimeListLinkStatus.Expired;
        malUser.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateMalUserAsync(malUser);
    }
}
