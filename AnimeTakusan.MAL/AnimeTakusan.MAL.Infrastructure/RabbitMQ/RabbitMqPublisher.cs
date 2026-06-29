using System.Text.Json;
using System.Text.Json.Serialization;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Infrastructure.RabbitMQ.Options;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace AnimeTakusan.MAL.Infrastructure.RabbitMQ;

public class RabbitMqPublisher : IMessagePublisher
{
    private readonly MalAuthEventOptions _options;
    private readonly IRabbitMqConnectionManager _connectionManager;

    public RabbitMqPublisher(IOptions<MalAuthEventOptions> options, IRabbitMqConnectionManager connectionManager)
    {
        _options = options.Value;
        _connectionManager = connectionManager;
    }

    public async Task PublishAsync<T>(T message, CancellationToken cancellationToken = default)
    {
        var connection = await _connectionManager.GetConnectionAsync(cancellationToken);
        using var channel = await connection.CreateChannelAsync(
            new CreateChannelOptions(publisherConfirmationsEnabled: true, publisherConfirmationTrackingEnabled: true), 
            cancellationToken: cancellationToken);

        var body = JsonSerializer.SerializeToUtf8Bytes(message, new JsonSerializerOptions{ Converters = { new JsonStringEnumConverter() }});

        var properties = new BasicProperties
        {
            Persistent = true,
            ContentType = "application/json",
            MessageId = Guid.NewGuid().ToString(),
            Timestamp = new AmqpTimestamp(DateTimeOffset.UtcNow.ToUnixTimeSeconds())
        };

        channel.BasicReturnAsync += (sender, args) =>
        {
            // TODO: Log
            //_logger.LogError("Messaggio non instradabile: {Reason}", args.ReplyText);
            return Task.CompletedTask;
        };

        await channel.BasicPublishAsync(
            exchange: _options.ExchangeName,
            routingKey: string.Empty,
            mandatory: true,
            basicProperties: properties,
            body: body,
            cancellationToken: cancellationToken);
    }
}
