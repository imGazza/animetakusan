namespace AnimeTakusan.Domain.Exceptions;

public class RoleCreationException : Exception
{
    public RoleCreationException(string role) : base($"Role creation failed for role {role}.")
    {
        
    }
}