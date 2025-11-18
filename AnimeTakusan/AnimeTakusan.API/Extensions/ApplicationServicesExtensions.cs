using AnimeTakusan.Data.Contexts;
using Microsoft.EntityFrameworkCore;

namespace AnimeTakusan.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static WebApplicationBuilder AddCorsPolicies(this WebApplicationBuilder Builder, IConfiguration Configuration)
        {
            var allowedOrigins = Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];

            // Allows only from specified domains
            Builder.Services.AddCors(options =>
            {
                options.AddPolicy("Public",
                    policy =>
                    {
                        policy.WithOrigins(allowedOrigins)
                              .AllowAnyHeader()
                              .WithMethods("GET", "OPTIONS")
                              .AllowCredentials()
                              .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache preflight for 10 minutes
                    });

                options.AddPolicy("Authenticated",
                    policy =>
                    {
                        policy.WithOrigins(allowedOrigins)
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .WithHeaders("Authorization", "Content-Type")
                              .AllowCredentials()
                              .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache preflight for 10 minutes
                    });
            });

            return Builder;
        }

        public static void ApplyDatabaseMigrations(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            
            try
            {
                var context = services.GetRequiredService<BaseContext>();
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
}
