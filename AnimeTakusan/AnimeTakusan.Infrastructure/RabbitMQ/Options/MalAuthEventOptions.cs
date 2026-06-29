namespace AnimeTakusan.Infrastructure.RabbitMQ.Options;

public class MalAuthEventOptions : RabbitMqOptions
{
    public new const string SectionName = "RabbitMq:MalAuthEvent";

    public string ExchangeName { get; set; } = "app.exchange";
    public string QueueName { get; set; } = "app.queue";
    public string RoutingKey { get; set; } = "app.routingkey";
    public int PrefetchCount { get; set; } = 10;
}
