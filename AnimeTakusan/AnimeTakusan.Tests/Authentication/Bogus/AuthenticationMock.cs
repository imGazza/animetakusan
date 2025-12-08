using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Domain.Entities;
using Bogus;

namespace AnimeTakusan.Tests.Authentication.Bogus;

/// <summary>
/// Provides Bogus faker configurations for authentication-related test data.
/// </summary>
public static class AuthenticationMock
{
    /// <summary>
    /// Creates a faker for generating User entities with realistic test data.
    /// </summary>
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

    /// <summary>
    /// Creates a faker for generating RegisterRequest DTOs with realistic test data.
    /// </summary>
    public static Faker<RegisterRequest> RegisterRequestFaker => new Faker<RegisterRequest>()
        .CustomInstantiator(f => new RegisterRequest
        {
            Username = f.Internet.UserName(),
            Email = f.Internet.Email(),
            Password = f.Internet.Password(),
            FirstName = f.Name.FirstName(),
            LastName = f.Name.LastName(),
            ProfilePicture = f.Internet.Avatar()
        });

    /// <summary>
    /// Creates a faker for generating LoginRequest DTOs with realistic test data.
    /// </summary>
    public static Faker<LoginRequest> LoginRequestFaker => new Faker<LoginRequest>()
        .CustomInstantiator(f => new LoginRequest
        {
            Email = f.Internet.Email(),
            Password = f.Internet.Password()
        });
}
