namespace AnimeTakusan.Domain.Entities;

public class AniListUser : Entity
{
    public int Id { get; set; }
    public int AniListUserId { get; set; }
    public Guid UserId { get; set; }
    public string AccessToken { get; set; }
    public DateTime? AccessTokenExpiry { get; set; }
    public User User { get; set; }
}
