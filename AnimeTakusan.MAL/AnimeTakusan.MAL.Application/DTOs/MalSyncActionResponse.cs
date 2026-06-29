using System.Text.Json.Serialization;

namespace AnimeTakusan.MAL.Application.DTOs;

public class MalSyncActionResponse
{
    [JsonPropertyName("updated_at")]
    public string UpdatedAt { get; set; }
}
