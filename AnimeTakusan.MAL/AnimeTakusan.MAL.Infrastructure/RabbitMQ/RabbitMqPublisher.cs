using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Application.Utility;
using AnimeTakusan.MAL.Infrastructure.RabbitMQ.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace AnimeTakusan.MAL.Infrastructure.RabbitMQ;

public class RabbitMqPublisher : IMessagePublisher
{
    private readonly MalAuthEventOptions _options;
    private readonly IRabbitMqConnectionManager _connectionManager;
    private readonly ILogger<RabbitMqPublisher> _logger;

    public RabbitMqPublisher(IOptions<MalAuthEventOptions> options, IRabbitMqConnectionManager connectionManager, ILogger<RabbitMqPublisher> logger)
    {
        _options = options.Value;
        _connectionManager = connectionManager;
        _logger = logger;
    }

    public async Task PublishAsync<T>(T message, CancellationToken cancellationToken = default)
    {
        var messageId = Guid.NewGuid().ToString();
        using var scope = _logger.PublisherLoggerScope(_options.ExchangeName, messageId, JsonSerializer.Serialize(message, new JsonSerializerOptions { Converters = { new JsonStringEnumConverter() } }));

        var connection = await _connectionManager.GetConnectionAsync(cancellationToken);
        using var channel = await connection.CreateChannelAsync(
            new CreateChannelOptions(publisherConfirmationsEnabled: true, publisherConfirmationTrackingEnabled: true), 
            cancellationToken: cancellationToken);

        _logger.LogDebug("Publishing message of type {MessageType} to exchange {ExchangeName}.", typeof(T).Name, _options.ExchangeName);

        var body = JsonSerializer.SerializeToUtf8Bytes(message, new JsonSerializerOptions{ Converters = { new JsonStringEnumConverter() }});

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

        _logger.LogInformation("Message of type {MessageType} published successfully to exchange {ExchangeName}.", typeof(T).Name, _options.ExchangeName);

    }
}
