namespace AnimeTakusan.Application.DTOs.Authentication.Responses;

public record TokenResponse
{
    public UserInfo User { get; init; }
    public string AccessToken { get; init; }
}

public record UserInfo
{
    public Guid Id { get; init; }
    public string Email { get; init; }
    public string Username { get; init; }
    public string ProfilePicture { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
}
