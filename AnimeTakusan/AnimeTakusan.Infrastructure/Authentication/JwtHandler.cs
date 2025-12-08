using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AnimeTakusan.Infrastructure.Authentication;

public class JwtHandler : IJwtHandler
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public JwtHandler(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetRefreshToken()
    {
        return _httpContextAccessor.HttpContext.Request.Cookies["APISID"];
    }

    public string GenerateGuestAccessToken()
    {
        (string jwtKey, string jwtIssuer, string jwtAudience) = ValidateJwtConfig();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, "Guest")
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateUserAccessToken(string refreshToken, User user, IList<string> userRoles)
    {     
        (string jwtKey, string jwtIssuer, string jwtAudience) = ValidateJwtConfig();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        foreach (var role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public void WriteRefreshTokenCookie(string token)
    {
        var expiration = DateTime.UtcNow.AddDays(7);
        _httpContextAccessor.HttpContext.Response.Cookies.Append(
            "APISID",
            token, new CookieOptions
            {
                HttpOnly = true,
                Expires = expiration,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
    }

    private (string jwtKey, string jwtIssuer, string jwtAudience) ValidateJwtConfig()
    {
        if (_configuration["Jwt:Key"] == null)
        {
            throw new ArgumentNullException("JWT Key is not configured.");
        }
        if (_configuration["Jwt:Issuer"] == null)
        {
            throw new ArgumentNullException("JWT Issuer is not configured.");
        }
        if (_configuration["Jwt:Audience"] == null)
        {
            throw new ArgumentNullException("JWT Audience is not configured.");
        }

        return (_configuration["Jwt:Key"]!, _configuration["Jwt:Issuer"]!, _configuration["Jwt:Audience"]!);
    }
}
