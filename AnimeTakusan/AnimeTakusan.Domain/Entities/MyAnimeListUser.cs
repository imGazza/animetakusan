using AnimeTakusan.Domain.Common;

namespace AnimeTakusan.Domain.Entities;

public class MyAnimeListUser : Entity
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int MalUserId { get; set; }    
    public DateTime RefreshTokenExpiry { get; set; }
    public MyAnimeListLinkStatus Status { get; set; }
    public User User { get; set; }
}
