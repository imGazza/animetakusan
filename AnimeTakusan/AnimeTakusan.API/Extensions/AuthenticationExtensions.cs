using System;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace AnimeTakusan.API.Extensions;

public static class AuthenticationExtensions
{
    public static AuthenticationBuilder AddBaseAuthentication(this IServiceCollection Services)
    {
        return Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
        });
    }

    public static AuthenticationBuilder AddGoogleAuthentication(this AuthenticationBuilder AuthBuilder, IConfiguration Configuration)
    {
        ValidateConfiguration(Configuration,
        [
            "Authentication:Google:ClientId",
            "Authentication:Google:ClientSecret"
        ]);

        return AuthBuilder.AddCookie().AddGoogle(options =>
        {
            options.ClientId = Configuration["Authentication:Google:ClientId"]!;
            options.ClientSecret = Configuration["Authentication:Google:ClientSecret"]!;

            options.Scope.Add("profile");
            options.Scope.Add("email");

            options.SaveTokens = true;
        });
    }

    public static AuthenticationBuilder AddJwtAuthentication(this AuthenticationBuilder AuthBuilder, IConfiguration Configuration)
    {
        ValidateConfiguration(Configuration,
        [
            "Jwt:Key",
            "Jwt:Issuer",
            "Jwt:Audience"
        ]);

        return AuthBuilder.AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Configuration["Jwt:Issuer"],
                ValidAudience = Configuration["Jwt:Audience"],
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!))
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["ACCESS_TOKEN"];
                    return Task.CompletedTask;
                }
            };
        });
    }

    private static void ValidateConfiguration(IConfiguration Configuration, string[] configKeys)
    {     
        foreach(string key in configKeys)
        {
            if (string.IsNullOrEmpty(Configuration[key]))
            {
                throw new ArgumentException($"Configuration key '{key}' is missing.");
            }
        }
    }
}
