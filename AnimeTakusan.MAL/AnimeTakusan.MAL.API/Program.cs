using System.Text.Json.Serialization;
using AnimeTakusan.MAL.API.Extensions;
using AnimeTakusan.MAL.API.Handlers;
using AnimeTakusan.MAL.Application.Handlers;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Application.Services;
using AnimeTakusan.MAL.Infrastructure;
using AnimeTakusan.MAL.Infrastructure.Mal;
using AnimeTakusan.MAL.Infrastructure.Protection;
using AnimeTakusan.MAL.Infrastructure.RabbitMQ;
using AnimeTakusan.MAL.Infrastructure.RabbitMQ.Options;
using AnimeTakusan.MAL.Infrastructure.Repositories;
using AnimeTakusan.MAL.Worker;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

Log.Information("Service starting up...");
builder.Services.AddSerilog();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<MalContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgresSQL"), npgsql =>
        npgsql.MigrationsHistoryTable("__EFMigrationsHistory_MAL", "mal"))
);

builder.Services.Configure<RabbitMqOptions>(builder.Configuration.GetSection(RabbitMqOptions.SectionName));
builder.Services.Configure<MalAuthEventOptions>(builder.Configuration.GetSection(MalAuthEventOptions.SectionName));
builder.Services.Configure<MalSyncActionOptions>(builder.Configuration.GetSection(MalSyncActionOptions.SectionName));

// RabbitMq
builder.Services.AddSingleton<IRabbitMqConnectionManager, RabbitMqConnectionManager>();
builder.Services.AddSingleton<IMessagePublisher, RabbitMqPublisher>();
builder.Services.AddSingleton<RabbitMqInitializer>();
builder.Services.AddHostedService<RabbitMqConsumerService>();

// Exception Handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddSingleton<IExceptionMapper, SyncActionExceptionMapper>();
builder.Services.AddSingleton<IExceptionMapper, MalAuthExceptionMapper>();

// Data Protection
builder.Services.AddScoped<ITokenProtector, DataProtectionTokenProtector>();
builder.Services.AddDataProtection().PersistKeysToDbContext<MalContext>();


builder.Services.AddHttpClient<IMalOAuthClient, MalOAuthClient>(client =>
    {
        client.BaseAddress = new Uri(builder.Configuration["Mal:AuthUrl"]!);
    }).AddStandardResilienceHandler();

builder.Services.AddHttpClient<IMalSyncClient, MalSyncClient>(client =>
    {
        client.BaseAddress = new Uri(builder.Configuration["Mal:SyncActionUrl"]!);
    }).AddStandardResilienceHandler();

builder.Services.AddScoped<IMalAuthService, MalAuthService>();
builder.Services.AddScoped<IMalSyncService, MalSyncService>();
builder.Services.AddScoped<IMalUserRepository, MalUserRepository>();
builder.Services.AddScoped<IMalReplayMessageRepository, MalReplayMessageRepository>();

var app = builder.Build();

// RabbitMq Initialization
using var scope = app.Services.CreateScope();
var initializer = scope.ServiceProvider.GetRequiredService<RabbitMqInitializer>();
await initializer.InitializeAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.ApplyDatabaseMigrations();

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();

app.MapControllers();



app.Run();
