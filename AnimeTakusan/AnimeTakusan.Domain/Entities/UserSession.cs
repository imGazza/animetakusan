namespace AnimeTakusan.Domain.Entities;

public class UserSession : Entity
{
    public int Id {get; set;}
    public Guid UserId {get; set;}
    public string RefreshToken {get; set;}
    public DateTime RefreshTokenExpiryTime { get; set; }

    public User User {get; set;}
}
