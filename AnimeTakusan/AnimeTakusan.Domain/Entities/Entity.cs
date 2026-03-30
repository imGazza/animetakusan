using System;

namespace AnimeTakusan.Domain.Entities;

public interface IEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Entity : IEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
