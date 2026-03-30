namespace AnimeTakusan.Application.DTOs.Authentication.Responses;

public class AniListTokenResponse
{
    public string AccessToken { get; set; }
    public int ExpiresIn { get; set; }
}
