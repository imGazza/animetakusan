using System;
using AnimeTakusan.MAL.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.MAL.API.Extensions;

public static class ApplicationServicesExtensions
{
    public static void ApplyDatabaseMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            
            try
            {
                var context = services.GetRequiredService<MalContext>();
                context.Database.Migrate();
                
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogInformation("Migrations successfully applied to the database.");
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Error occurred while migrating the database.");
                throw;
            }
    }
}
