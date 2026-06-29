using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.Application.DTOs.Messages;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Common;
using AnimeTakusan.Domain.Entities;

namespace AnimeTakusan.Application.Handlers.ConsumerHandlers;

public class MalAuthEventHandler : IMessageHandler
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };

    private readonly IUserRepository _userRepository;

    public MalAuthEventHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task HandleMessageAsync(string message)
    {
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
                break;
            case Status.Refreshed:
                await RefreshMalAccount(malAuthEvent, malUser);
                break;
            case Status.Expired:
                await UnlinkMalAccount(malAuthEvent, malUser);
                break;
            default:
                throw new NotImplementedException("There is no behaviour for this status.");
        }
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
