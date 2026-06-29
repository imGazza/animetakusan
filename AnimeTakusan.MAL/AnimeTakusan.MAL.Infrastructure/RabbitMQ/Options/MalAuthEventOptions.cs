
namespace AnimeTakusan.MAL.Infrastructure.RabbitMQ.Options;

public class MalAuthEventOptions : RabbitMqOptions
{
    public new const string SectionName = "RabbitMq:MalAuthEvent";

    public string ExchangeName { get; set; } = "app.exchange";
    public string QueueName { get; set; } = "app.queue";
    public int PrefetchCount { get; set; } = 10;
}
