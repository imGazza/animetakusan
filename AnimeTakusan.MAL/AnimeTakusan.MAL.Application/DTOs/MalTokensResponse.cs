using System.Text.Json.Serialization;

namespace AnimeTakusan.MAL.Application.DTOs;

public class MalTokensResponse
{
    [JsonPropertyName("access_token")]
    public required string AccessToken { get; init; }

    [JsonPropertyName("refresh_token")]
    public required string RefreshToken { get; init; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; init; }
}
