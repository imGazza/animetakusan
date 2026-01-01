using AnimeTakusan.AnimeProviders;
using AnimeTakusan.AnimeProviders.Queries;
using AnimeTakusan.API.Extensions;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Validators;
using AnimeTakusan.Infrastructure.Authentication;
using AnimeTakusan.Infrastructure.Contexts;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

Log.Information("Application starting up...");
builder.Services.AddSerilog();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJwtHandler, JwtHandler>();
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

// CORS
builder.AddCorsPolicies(builder.Configuration);

builder.Services.AddDbContext<BaseContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgresSQL"))
);

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

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
