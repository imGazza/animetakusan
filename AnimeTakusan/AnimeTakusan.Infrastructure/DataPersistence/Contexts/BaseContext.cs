using AnimeTakusan.Domain.Entitities;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.Infrastructure.Contexts;

public class BaseContext : DbContext
{
    public BaseContext(DbContextOptions<BaseContext> options) : base(options){}

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaseContext).Assembly);
    }
}
