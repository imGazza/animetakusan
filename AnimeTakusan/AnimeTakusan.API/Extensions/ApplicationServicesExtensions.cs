namespace AnimeTakusan.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static WebApplicationBuilder AddCorsPolicies(this WebApplicationBuilder Builder)
        {
            var allowedOrigins = Builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];

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
    }
}
