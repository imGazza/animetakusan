using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Infrastructure.RabbitMQ.Options;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace AnimeTakusan.Infrastructure.RabbitMQ;

public class RabbitMqInitializer
{
    private readonly MalAuthEventOptions _options;
    private readonly IRabbitMqConnectionManager _connectionManager;

    public RabbitMqInitializer(IOptions<MalAuthEventOptions> options, IRabbitMqConnectionManager connectionManager)
    {
        _options = options.Value;
        _connectionManager = connectionManager;
    }

    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        var connection = await _connectionManager.GetConnectionAsync(cancellationToken);
        using var channel = await connection.CreateChannelAsync(cancellationToken: cancellationToken);

        // --- DEAD LETTER QUEUE ---

        var deadLetterExchangeName = $"{_options.ExchangeName}.dlx";
        var deadLetterQueueName = $"{_options.QueueName}.dlq";

        await channel.ExchangeDeclareAsync(exchange: deadLetterExchangeName, type: ExchangeType.Fanout, durable: true, cancellationToken: cancellationToken);
        await channel.QueueDeclareAsync(queue: deadLetterQueueName, durable: true, exclusive: false, autoDelete: false, cancellationToken: cancellationToken);
        await channel.QueueBindAsync(queue: deadLetterQueueName, exchange: deadLetterExchangeName, routingKey: string.Empty, cancellationToken: cancellationToken);

        // --- MAIN QUEUE ---

        await channel.ExchangeDeclareAsync(exchange: _options.ExchangeName, type: ExchangeType.Fanout, durable: true, cancellationToken: cancellationToken);
        await channel.QueueDeclareAsync(queue: _options.QueueName, durable: true, exclusive: false, autoDelete: false, 
            arguments: new Dictionary<string, object?> { { "x-queue-type", "quorum" }, { "x-dead-letter-exchange", deadLetterExchangeName } }, cancellationToken: cancellationToken);
        await channel.QueueBindAsync(queue: _options.QueueName, exchange: _options.ExchangeName, routingKey: string.Empty, cancellationToken: cancellationToken);
    }
}
