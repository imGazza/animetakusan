using Microsoft.AspNetCore.Identity;

namespace AnimeTakusan.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public AniListUser AniListUser { get; set; }
    public MyAnimeListUser MyAnimeListUser { get; set; }
}
