using AnimeTakusan.Domain.Entitities;

namespace AnimeTakusan.Domain.Exceptions;

public class RoleAssignmentException : Exception
{
    public RoleAssignmentException(string role, string email) : base($"Role assignment failed for role {role} to user {email}.")
    {
        
    }
}