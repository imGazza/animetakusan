using System.Text;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Infrastructure.RabbitMQ;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace AnimeTakusan.MAL.Worker;

public class RabbitMqConsumerService : BackgroundService
{
    private readonly MalSyncActionOptions _options;
    private readonly IRabbitMqConnectionManager _connectionManager;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private IChannel? _channel;

    public RabbitMqConsumerService(IOptions<MalSyncActionOptions> options, IRabbitMqConnectionManager connectionManager, IServiceScopeFactory serviceScopeFactory)
    {
        _options = options.Value;
        _connectionManager = connectionManager;
        _serviceScopeFactory = serviceScopeFactory;
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
        using var scope = _serviceScopeFactory.CreateScope();
        var messageHandler = scope.ServiceProvider.GetRequiredService<IMessageHandler>();

        var jsonMessage = Encoding.UTF8.GetString(eventArgs.Body.ToArray());

        try
        {
            await messageHandler.HandleMessageAsync(jsonMessage);
            
            await _channel!.BasicAckAsync(eventArgs.DeliveryTag, multiple: false);
        }
        catch (Exception)
        {            
            await _channel!.BasicNackAsync(eventArgs.DeliveryTag, multiple: false, requeue: false);
        }
    }
}
