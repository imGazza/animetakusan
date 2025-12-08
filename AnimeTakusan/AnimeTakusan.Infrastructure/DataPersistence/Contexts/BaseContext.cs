using AnimeTakusan.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.Infrastructure.Contexts;

public class BaseContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public BaseContext(DbContextOptions<BaseContext> options) : base(options){}

    public override DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaseContext).Assembly);
    }
}
