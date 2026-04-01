using System.Text.Json.Serialization;

namespace AnimeTakusan.Application.DTOs.Authentication.Responses;

public class AniListTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}
