using Microsoft.AspNetCore.Identity;

namespace AnimeTakusan.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public AniListUser AniListUser { get; set; }
    public MyAnimeListUser MyAnimeListUser { get; set; }
    public ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
}
