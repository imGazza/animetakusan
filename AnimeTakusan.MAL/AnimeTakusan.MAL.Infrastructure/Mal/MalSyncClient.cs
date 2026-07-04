using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.DTOs;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Application.Mapping;
using AnimeTakusan.MAL.Domain.Exception.SyncActionExceptions;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.MAL.Infrastructure.Mal;

public class MalSyncClient : IMalSyncClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<MalSyncClient> _logger;
    private readonly ITokenProtector _tokenProtector;

    public MalSyncClient(HttpClient httpClient, ILogger<MalSyncClient> logger, ITokenProtector tokenProtector)
    {
        _httpClient = httpClient;
        _logger = logger;
        _tokenProtector = tokenProtector;
    }

    public async Task SyncAnimeAsync(MalSyncActionMessage message, string accessToken)
    {
        using var scope = _logger.BeginScope(
            new Dictionary<string, object>
            {
                ["Layer"] = "MyAnimeList",
                ["Action"] = message.Action.ToString(),
                ["AnimeId"] = message.AnimeId,
                ["MalUserId"] = message.MalUserId,
                ["RequestData"] = JsonSerializer.Serialize(message, new JsonSerializerOptions { Converters = { new JsonStringEnumConverter() } })
            }
        );

        // If Delete action, we don't need to send any data
        if(message.Action == SyncAction.Delete)
        {
            await DeleteSyncRequestAsync(accessToken, message.AnimeId);
            _logger.LogInformation("Deleted anime {AnimeId} for MAL user {MalUserId}", message.AnimeId, message.MalUserId);
            return;
        }

        var requestData = new Dictionary<string, string>();

        if (message.Status.HasValue)
            requestData["status"] = MalSyncMapper.ToMalStatus(message.Status.Value).ToMalString();

        if (message.Score.HasValue)
            requestData["score"] = MalSyncMapper.ToMalScore(message.Score.Value).ToString();

        if (message.Progress.HasValue)
            requestData["num_watched_episodes"] = message.Progress.Value.ToString();

        var startDate = MalSyncMapper.ToMalDate(message.StartedAt);
        if (startDate != null)
            requestData["start_date"] = startDate;

        var finishDate = MalSyncMapper.ToMalDate(message.CompletedAt);
        if (finishDate != null)
            requestData["finish_date"] = finishDate;

        if(message.Status == MalSyncActionStatus.REPEATING)
            requestData["is_rewatching"] = "true";

        // Ignoring result for now as nothing is needed to be done with it
        await PatchSyncRequestAsync(requestData, message.AnimeId, accessToken);
        _logger.LogInformation("Synced anime {AnimeId} for MAL user {MalUserId}", message.AnimeId, message.MalUserId);
    }

    private async Task PatchSyncRequestAsync(Dictionary<string, string> requestData, int animeId, string accessToken)
    {
        var url = $"{animeId}/my_list_status";

        var request = new HttpRequestMessage(HttpMethod.Patch, url)
        {
            Content = new FormUrlEncodedContent(requestData)
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _tokenProtector.Unprotect(accessToken));

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();
    }

    private async Task DeleteSyncRequestAsync(string accessToken, int animeId)
    {
        var url = $"{animeId}/my_list_status";

        var request = new HttpRequestMessage(HttpMethod.Delete, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _tokenProtector.Unprotect(accessToken));

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();
    }
}
