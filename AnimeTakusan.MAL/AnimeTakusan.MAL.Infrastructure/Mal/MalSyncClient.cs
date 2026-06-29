using System.Net.Http.Headers;
using System.Net.Http.Json;
using AnimeTakusan.MAL.Application.DTOs;
using AnimeTakusan.MAL.Application.DTOs.Messages;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Application.Mapping;

namespace AnimeTakusan.MAL.Infrastructure.Mal;

public class MalSyncClient : IMalSyncClient
{
    private readonly HttpClient _httpClient;

    public MalSyncClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task SyncAnimeAsync(MalSyncActionMessage message, string accessToken)
    {
        // If Delete action, we don't need to send any data
        if(message.Action == SyncAction.Delete)
        {
            await DeleteSyncRequestAsync(accessToken, message.AnimeId);
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
        // Will be used with logging in the future
        await PatchSyncRequestAsync(requestData, message.AnimeId, accessToken);
    }

    private async Task<MalSyncActionResponse> PatchSyncRequestAsync(Dictionary<string, string> requestData, int animeId, string accessToken)
    {
        var url = $"{animeId}/my_list_status";

        var request = new HttpRequestMessage(HttpMethod.Patch, url)
        {
            Content = new FormUrlEncodedContent(requestData)
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        var syncResponse = await response.Content.ReadFromJsonAsync<MalSyncActionResponse>();
        if (syncResponse == null)
        {
            throw new InvalidOperationException("MAL sync endpoint returned an empty response.");
        }

        return syncResponse;
    }

    private async Task<MalSyncActionResponse> DeleteSyncRequestAsync(string accessToken, int animeId)
    {
        var url = $"{animeId}/my_list_status";

        var request = new HttpRequestMessage(HttpMethod.Delete, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        var syncResponse = await response.Content.ReadFromJsonAsync<MalSyncActionResponse>();
        if (syncResponse == null)
        {
            throw new InvalidOperationException("MAL sync endpoint returned an empty response.");
        }

        return syncResponse;
    }
}
