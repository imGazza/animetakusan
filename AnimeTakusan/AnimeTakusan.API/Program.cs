using AnimeTakusan.API.Extensions;
using AnimeTakusan.Data.Contexts;
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

// Authentication
builder.Services
.AddBaseAuthentication()
.AddGoogleAuthentication(builder.Configuration)
.AddJwtAuthentication(builder.Configuration);

// CORS
builder.AddCorsPolicies(builder.Configuration);

builder.Services.AddDbContext<BaseContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgresSQL"))
);

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

app.UseAuthorization();

app.MapControllers();

app.Run();
