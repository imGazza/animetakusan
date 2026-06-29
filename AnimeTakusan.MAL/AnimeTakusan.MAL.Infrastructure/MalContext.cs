using AnimeTakusan.MAL.Domain;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.MAL.Infrastructure;

public class MalContext : DbContext
{
    public MalContext(DbContextOptions<MalContext> options) : base(options){}

    public DbSet<MalUser> MalUsers { get; set; }
    public DbSet<MalReplayMessage> MalReplayMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("mal");
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MalContext).Assembly);
    }
}

