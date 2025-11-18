namespace AnimeTakusan.Data.Model;

public class User : IEntityGuid
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ProfilePicture { get; set; }
    public string Email { get; set; }
}
