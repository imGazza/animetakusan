using AnimeTakusan.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;

namespace AnimeTakusan.Domain.Entitities;

public class User : IdentityUser<Guid>
{
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ProfilePicture { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
