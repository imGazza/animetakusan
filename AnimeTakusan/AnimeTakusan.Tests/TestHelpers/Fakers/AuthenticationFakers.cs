using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Domain.Entities;
using Bogus;
using Microsoft.AspNetCore.Identity;

namespace AnimeTakusan.Tests.TestHelpers.Fakers;

/// <summary>
/// Provides Bogus faker configurations for authentication-related test data.
/// </summary>
public static class AuthenticationFakers
{
    public static Faker<User> UserFaker => new Faker<User>()
        .RuleFor(u => u.Id, f => Guid.NewGuid())
        .RuleFor(u => u.UserName, f => f.Internet.UserName())
        .RuleFor(u => u.Email, f => f.Internet.Email())
        .RuleFor(u => u.FirstName, f => f.Name.FirstName())
        .RuleFor(u => u.LastName, f => f.Name.LastName())
        .RuleFor(u => u.ProfilePicture, f => f.Internet.Avatar())
        .RuleFor(u => u.RefreshToken, f => Guid.NewGuid().ToString())
        .RuleFor(u => u.RefreshTokenExpiryTime, f => DateTime.UtcNow.AddDays(7))
        .RuleFor(u => u.CreatedAt, f => DateTime.UtcNow)
        .RuleFor(u => u.UpdatedAt, f => DateTime.UtcNow);

    public static Faker<RegisterRequest> RegisterRequestFaker => new Faker<RegisterRequest>()
        .RuleFor(r => r.Username, f => f.Internet.UserName())
        .RuleFor(r => r.Email, f => f.Internet.Email())
        .RuleFor(r => r.Password, f => f.Internet.Password())
        .RuleFor(r => r.ConfirmPassword, (f, r) => r.Password);

    public static Faker<LoginRequest> LoginRequestFaker => new Faker<LoginRequest>()
        .RuleFor(r => r.Email, f => f.Internet.Email())
        .RuleFor(r => r.Password, f => f.Internet.Password());
}
