namespace AnimeTakusan.Application.DTOs.Authentication.Responses;

public record TokenResponse
{
    public string AccessToken { get; init; }
    public DateTime ExpiresAt { get; init; }
}
