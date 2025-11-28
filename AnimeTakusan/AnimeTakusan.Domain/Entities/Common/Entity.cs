namespace AnimeTakusan.Domain.Entities.Common;

public class Entity<TPrimitive>
{
    public TPrimitive Id { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
