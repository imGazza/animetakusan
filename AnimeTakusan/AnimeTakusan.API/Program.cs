using System.Text.Json.Serialization;
using AnimeTakusan.API.Extensions;
using AnimeTakusan.API.Handlers.ConsumerHandlers;
using AnimeTakusan.Application.Handlers.ConsumerHandlers;
using AnimeTakusan.Application.Caching;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.RabbitMq;
using AnimeTakusan.Application.Validators;
using AnimeTakusan.Infrastructure.Authentication;
using AnimeTakusan.Infrastructure.Contexts;
using AnimeTakusan.Infrastructure.Protection;
using AnimeTakusan.Infrastructure.RabbitMQ;
using AnimeTakusan.Infrastructure.RabbitMQ.Options;
using FluentValidation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();
    

Log.Information("Application starting up...");
builder.Services.AddSerilog();

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