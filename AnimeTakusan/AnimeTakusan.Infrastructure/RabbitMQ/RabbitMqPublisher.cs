using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;
using AnimeTakusan.Infrastructure.RabbitMQ.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace AnimeTakusan.Application.RabbitMq;

public class RabbitMqPublisher : IMessagePublisher
{
    private readonly MalSyncActionOptions _options;
    private readonly IRabbitMqConnectionManager _connectionManager;
    private readonly ILogger<RabbitMqPublisher> _logger;

    public RabbitMqPublisher(IOptions<MalSyncActionOptions> options, IRabbitMqConnectionManager connectionManager, ILogger<RabbitMqPublisher> logger)
    {
        _options = options.Value;
        _connectionManager = connectionManager;
        _logger = logger;
    }

    public async Task PublishAsync<T>(T message, CancellationToken cancellationToken = default)
    {
        var messageId = Guid.NewGuid().ToString();
        using var loggerScope = _logger.PublisherLoggerScope(_options.ExchangeName, messageId, JsonSerializer.Serialize(message, new JsonSerializerOptions { Converters = { new JsonStringEnumConverter() } }));

        var connection = await _connectionManager.GetConnectionAsync(cancellationToken);
        using var channel = await connection.CreateChannelAsync(
            new CreateChannelOptions(publisherConfirmationsEnabled: true, publisherConfirmationTrackingEnabled: true), 
            cancellationToken: cancellationToken);
            
        _logger.LogDebug("Publishing message of type {MessageType} with ID {MessageId} to exchange {ExchangeName}.", typeof(T).Name, messageId, _options.ExchangeName);

        var body = JsonSerializer.SerializeToUtf8Bytes(message, new JsonSerializerOptions { Converters = { new JsonStringEnumConverter() } });

        var properties = new BasicProperties
        {
            Persistent = true,
            ContentType = "application/json",
            MessageId = messageId,
            Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds())
        };

        channel.BasicReturnAsync += (sender, args) =>
        {
            _logger.LogError("Error while publishing message: {Reason}", args.ReplyText);
            return Task.CompletedTask;
        };

        await channel.BasicPublishAsync(
            exchange: _options.ExchangeName,
            routingKey: string.Empty,
            mandatory: true,
            basicProperties: properties,
            body: body,
            cancellationToken: cancellationToken);
        
        _logger.LogInformation("Message ID {MessageId} published successfully to exchange {ExchangeName}.", messageId, _options.ExchangeName);
    }
}