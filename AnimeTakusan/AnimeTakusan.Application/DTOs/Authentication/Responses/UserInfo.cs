using System;

namespace AnimeTakusan.Application.DTOs.Authentication.Responses;

public record UserInfo
{
    public Guid Id { get; init; }
    public string Email { get; init; }
    public string UserName { get; init; }
    public string ProfilePicture { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
}
