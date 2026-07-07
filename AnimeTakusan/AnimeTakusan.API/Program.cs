using System.Text.Json.Serialization;
using AnimeTakusan.API.Extensions;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Validators;
using AnimeTakusan.Infrastructure.Authentication;
using AnimeTakusan.Infrastructure.Contexts;
using AnimeTakusan.Infrastructure.Protection;
using AnimeTakusan.Infrastructure.RabbitMQ;
using FluentValidation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();
    

Log.Information("Application starting up...");
builder.Services.AddSerilog();

builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("PostgresSQL")!)
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "animetakusan";
});

builder.Services.AddConfigurationOptions(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Mapster Configuration
builder.Services.AddMapster();

// Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtHandler, JwtHandler>();
builder.Services.AddScoped<ITokenProtector, DataProtectionTokenProtector>();

// RabbitMq
builder.Services.AddRabbitMqConfiguration(builder.Configuration);

builder.Services.AddAniListAnimeProvider(builder.Configuration);
builder.Services.AddValidatorsFromAssemblyContaining<ICustomValidator>();
builder.AddServices();

// Rate Limiting
builder.Services.AddRateLimiting();

// Authentication
builder
.AddIdentity()
.AddBaseAuthentication()
.AddGoogleAuthentication(builder.Configuration)
.AddJwtAuthentication(builder.Configuration);

// Proxy configurations
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

// Exception Handling
builder.Services.AddExceptionHandling();

// Data protection
builder.Services.AddDataProtection().PersistKeysToDbContext<BaseContext>();

// CORS
builder.AddCorsPolicies(builder.Configuration);

builder.Services.AddDbContext<BaseContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgresSQL"))
);

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// RabbitMq Initialization
using var scope = app.Services.CreateScope();
var initializer = scope.ServiceProvider.GetRequiredService<RabbitMqInitializer>();
await initializer.InitializeAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Proxy configurations (uses the headers declared above)
app.UseForwardedHeaders();

app.MapHealthChecks("/health", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/ready");     

app.ApplyDatabaseMigrations();

app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.UseCors("Public");
app.UseCors("Authenticated");

app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();