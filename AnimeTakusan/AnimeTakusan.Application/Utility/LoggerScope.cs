using Microsoft.Extensions.Logging;

namespace AnimeTakusan.Application.Utility;

public static class LoggerScope
{
    public static IDisposable PublisherLoggerScope(this ILogger logger, string exchangeName, string messageId, string message)
    {
        return logger.BeginScope(new Dictionary<string, object>
        {
            ["Layer"] = "Broker",
            ["Operation"] = "Publish",
            ["ExchangeName"] = exchangeName,
            ["MessageId"] = messageId,
            ["Message"] = message
        });
    }

    public static IDisposable ConsumerLoggerScope(this ILogger logger, string messageId, string message)
    {
        return logger.BeginScope(new Dictionary<string, object>
        {
            ["Layer"] = "Broker",
            ["Operation"] = "Consume",
            ["MessageId"] = messageId,
            ["Message"] = message
        });
    }
}
