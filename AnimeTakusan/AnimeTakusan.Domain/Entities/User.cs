using AnimeTakusan.Domain.Entities.Common;

namespace AnimeTakusan.Domain.Entitities;

public class User : Entity<Guid>
{
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ProfilePicture { get; set; }
    public string Email { get; set; } 
}
