using System.Text;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Infrastructure.RabbitMQ.Options;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace AnimeTakusan.API.Handlers.ConsumerHandlers;

public class RabbitMqConsumerService : BackgroundService
{
    private readonly MalAuthEventOptions _options;
    private readonly IRabbitMqConnectionManager _connectionManager;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private IChannel? _channel;
    private readonly ILogger<RabbitMqConsumerService> _logger;

    public RabbitMqConsumerService(IOptions<MalAuthEventOptions> options, IRabbitMqConnectionManager connectionManager, IServiceScopeFactory serviceScopeFactory, ILogger<RabbitMqConsumerService> logger)
    {
        _options = options.Value;
        _connectionManager = connectionManager;
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connection = await _connectionManager.GetConnectionAsync(stoppingToken);
        _channel = await connection.CreateChannelAsync(options: new CreateChannelOptions(
            publisherConfirmationsEnabled: false,
            publisherConfirmationTrackingEnabled: false,
            consumerDispatchConcurrency: 1
        ), cancellationToken: stoppingToken);

        await _channel.BasicQosAsync(prefetchSize: 0, prefetchCount: (ushort)_options.PrefetchCount, global: false, cancellationToken: stoppingToken);
        
        var consumer = new AsyncEventingBasicConsumer(_channel);
        consumer.ReceivedAsync += HandleMessageAsync;

        await _channel.BasicConsumeAsync(queue: _options.QueueName, autoAck: false, consumer, stoppingToken);

        // Keeps the service running until shutdown is requested
        try
        {
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        catch (OperationCanceledException)
        {
            // Expected on graceful shutdown
        }
    }

    private async Task HandleMessageAsync(object sender, BasicDeliverEventArgs eventArgs)
    {
        var messageId = eventArgs.BasicProperties.MessageId;

        try
        {
            var jsonMessage = Encoding.UTF8.GetString(eventArgs.Body.ToArray());
            _logger.LogInformation("Received message {MessageId} on queue {QueueName}.", messageId, _options.QueueName);

            using var scope = _serviceScopeFactory.CreateScope();
            var messageHandler = scope.ServiceProvider.GetRequiredService<IMessageHandler>();

            await messageHandler.HandleMessageAsync(jsonMessage, messageId);

            await _channel!.BasicAckAsync(eventArgs.DeliveryTag, multiple: false);
            _logger.LogInformation("Message {MessageId} acknowledged.", messageId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while handling message {MessageId}; dead-lettering.", messageId);
            await _channel!.BasicNackAsync(eventArgs.DeliveryTag, multiple: false, requeue: false);
        }
    }
}
