using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Domain.Entities;
using Bogus;

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
        .RuleFor(u => u.CreatedAt, f => DateTime.UtcNow)
        .RuleFor(u => u.UpdatedAt, f => DateTime.UtcNow);

    public static Faker<UserSession> UserSessionFaker => new Faker<UserSession>()
        .RuleFor(s => s.Id, f => f.Random.Int(1, 10000))
        .RuleFor(s => s.RefreshToken, f => Guid.NewGuid().ToString())
        .RuleFor(s => s.RefreshTokenExpiryTime, f => DateTime.UtcNow.AddDays(7))
        .RuleFor(s => s.User, f => UserFaker.Generate())
        .RuleFor(s => s.UserId, (f, s) => s.User.Id)
        .RuleFor(s => s.CreatedAt, f => DateTime.UtcNow)
        .RuleFor(s => s.UpdatedAt, f => DateTime.UtcNow);

    /// <summary>
    /// Builds an active session for the given user and refresh token.
    /// </summary>
    public static UserSession SessionFor(User user, string refreshToken) =>
        UserSessionFaker.Clone()
            .RuleFor(s => s.User, f => user)
            .RuleFor(s => s.UserId, f => user.Id)
            .RuleFor(s => s.RefreshToken, f => refreshToken)
            .Generate();

    public static Faker<RegisterRequest> RegisterRequestFaker => new Faker<RegisterRequest>()
        .RuleFor(r => r.Username, f => f.Internet.UserName())
        .RuleFor(r => r.Email, f => f.Internet.Email())
        .RuleFor(r => r.Password, f => f.Internet.Password())
        .RuleFor(r => r.ConfirmPassword, (f, r) => r.Password);

    public static Faker<LoginRequest> LoginRequestFaker => new Faker<LoginRequest>()
        .RuleFor(r => r.Email, f => f.Internet.Email())
        .RuleFor(r => r.Password, f => f.Internet.Password());
}
