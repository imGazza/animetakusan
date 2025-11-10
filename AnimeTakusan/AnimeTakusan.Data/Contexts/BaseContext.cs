using AnimeTakusan.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.Data.Contexts;

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
