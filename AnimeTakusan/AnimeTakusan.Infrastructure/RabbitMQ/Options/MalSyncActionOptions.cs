using System;

namespace AnimeTakusan.Infrastructure.RabbitMQ.Options;

public class MalSyncActionOptions : RabbitMqOptions
{
    public new const string SectionName = "RabbitMq:MalSyncAction";

    public string ExchangeName { get; set; } = "app.exchange";
    public string QueueName { get; set; } = "app.queue";
    public string RoutingKey { get; set; } = "app.routingkey";
    public int PrefetchCount { get; set; } = 10;
}
