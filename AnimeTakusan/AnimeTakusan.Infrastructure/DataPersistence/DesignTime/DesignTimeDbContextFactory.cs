using AnimeTakusan.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AnimeTakusan.Data.DesignTime;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<BaseContext>
{
    public BaseContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "..", "AnimeTakusan.API"))
            .AddJsonFile("appsettings.Development.json", optional: false, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();
            
        var optionsBuilder = new DbContextOptionsBuilder<BaseContext>();
        optionsBuilder.UseNpgsql(configuration.GetConnectionString("PostgresSQL"));
        
        return new BaseContext(optionsBuilder.Options);
    }
}
