using AnimeTakusan.MAL.Infrastructure.RabbitMQ.Options;

namespace AnimeTakusan.MAL.Infrastructure.RabbitMQ;
    
public class MalSyncActionOptions : RabbitMqOptions
{
    public new const string SectionName = "RabbitMq:MalSyncAction";

    public string ExchangeName { get; set; } = "app.exchange";
    public string QueueName { get; set; } = "app.queue";
    public int PrefetchCount { get; set; } = 10;
}
