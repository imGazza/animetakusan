using System;

namespace AnimeTakusan.MAL.Domain;

public class MalUser
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int MalUserId { get; set; }
    public string RefreshToken { get; set; }
    public string AccessToken { get; set; }
    public DateTime RefreshTokenExpiresAt { get; set; }
    public DateTime AccessTokenExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
