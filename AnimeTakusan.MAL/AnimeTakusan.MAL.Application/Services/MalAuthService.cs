using System.Text;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.JsonWebTokens;

namespace AnimeTakusan.MAL.Application.Services;

public class MalAuthService : IMalAuthService
{
    private readonly IMalOAuthClient _malOAuthClient;
    private readonly IMalUserRepository _malUserRepository;
    private readonly IMessagePublisher _messagePublisher;
    private readonly IMalSyncService _malSyncService;

    public MalAuthService(
        IMalOAuthClient malOAuthClient,
        IMalUserRepository malUserRepository,
        IMessagePublisher messagePublisher,
        IMalSyncService malSyncService)
    {
        _malOAuthClient = malOAuthClient;
        _malUserRepository = malUserRepository;
        _messagePublisher = messagePublisher;
        _malSyncService = malSyncService;
    }

    public async Task AuthenticateMalUser(string code, string codeVerifier, string state)
    {
        var userId = ExtractUserIdFromState(state);

        var tokens = await _malOAuthClient.ExchangeCodeAsync(code, codeVerifier);
        var malUserId = GetMalUserId(tokens.AccessToken);

        var user = new MalUser
        {
            UserId = new Guid(userId),
            MalUserId = int.Parse(malUserId),
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshToken,
            AccessTokenExpiresAt = DateTime.UtcNow.AddDays(21), // 2 minutes less than the real expiration
            RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(26) // 5 days less then the real expiration of 31 days
        };

        await _malUserRepository.UpsertAsync(user);

        await _malSyncService.ReplayAllAsync(user);

        // Publish account linked message
        // Expiration set as the AccessTokenExpiresAt in order to let expire the main app record before the actual refresh token expires
        await _messagePublisher.PublishAsync(new MalAuthEventMessage(
            user.UserId,
            user.MalUserId,
            user.AccessTokenExpiresAt,
            Status.Linked
        ));
    }

    public async Task<string> RefreshToken(MalUser malUser)
    {
        var tokens = await _malOAuthClient.RefreshTokenAsync(malUser.RefreshToken);

        malUser.AccessToken = tokens.AccessToken;
        malUser.RefreshToken = tokens.RefreshToken;
        malUser.AccessTokenExpiresAt = DateTime.UtcNow.AddDays(21); // 2 minutes less than the real expiration
        malUser.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(26); // 5 days less then the real expiration of 31 days

        await _malUserRepository.UpdateTokens(malUser);

        // Publish token refreshed message
        // Expiration set as the AccessTokenExpiresAt in order to let expire the main app record before the actual refresh token expires
        await _messagePublisher.PublishAsync(new MalAuthEventMessage(
            malUser.UserId,
            malUser.MalUserId,
            malUser.AccessTokenExpiresAt,
            Status.Refreshed
        ));

        return tokens.AccessToken;
    }

    private string ExtractUserIdFromState(string state)
    {
        var decoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(state));

        // decoded = "userId:randomNonce"
        return decoded.Split(':', 2)[0];
    }

    private string GetMalUserId(string token)
    {
        var tokenHandler = new JsonWebTokenHandler();
        if (!tokenHandler.CanReadToken(token))
            throw new ArgumentException("MAL access token is not a valid JWT.");

        var jwt = tokenHandler.ReadJsonWebToken(token);
        var malUserId = jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

        if (string.IsNullOrEmpty(malUserId))
        {
            throw new ArgumentException("Failed to extract MAL user ID from access token.");
        }

        return malUserId;
    }

}
