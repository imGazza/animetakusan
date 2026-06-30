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

    private const string RefreshTokenCookieId = "_atsrt";

    public JwtHandler(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetRefreshToken()
    {
        return _httpContextAccessor.HttpContext.Request.Cookies[RefreshTokenCookieId];
    }

    public (string Token, DateTime ExpiresAt) GenerateGuestAccessToken()
    {
        (string jwtKey, string jwtIssuer, string jwtAudience) = ValidateJwtConfig();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, "Guest")
        };

        var expiresAt = DateTime.UtcNow.AddMinutes(15);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        expiresAt = expiresAt.AddMinutes(-1); // 1 minute before actual expiring for safety
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return (tokenString, expiresAt);
    }

    public (string Token, DateTime ExpiresAt) GenerateUserAccessToken(User user, List<Claim> additionalClaims)
    {
        (string jwtKey, string jwtIssuer, string jwtAudience) = ValidateJwtConfig();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        foreach (var claim in additionalClaims)
        {
            claims.Add(claim);
        }

        var expiresAt = DateTime.UtcNow.AddMinutes(15);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        expiresAt = expiresAt.AddMinutes(-1); // 1 minute before actual expiring for safety
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return (tokenString, expiresAt);
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
            RefreshTokenCookieId,
            token, new CookieOptions
            {
                HttpOnly = true,
                Expires = expiration,
                IsEssential = true,
                Secure = true,
                SameSite = Enum.Parse<SameSiteMode>(_configuration["CookiesSettings:SameSite"] ?? "Lax"),
                Domain = _configuration["CookiesSettings:Domain"]
            });
    }

    public void DeleteRefreshTokenCookie()
    {
        _httpContextAccessor.HttpContext.Response.Cookies.Append(
            RefreshTokenCookieId,
            string.Empty,
            new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(-1),
                IsEssential = true,
                Secure = true,
                SameSite = Enum.Parse<SameSiteMode>(_configuration["CookiesSettings:SameSite"] ?? "Lax"),
                Domain = _configuration["CookiesSettings:Domain"]
            });
    }

    public List<Claim> GetAniListTokenClaims(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        if (!tokenHandler.CanReadToken(token))
            throw new ArgumentException("AniList access token is not a valid JWT.");

        var jwt = tokenHandler.ReadJwtToken(token);
        return jwt.Claims.ToList();
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
