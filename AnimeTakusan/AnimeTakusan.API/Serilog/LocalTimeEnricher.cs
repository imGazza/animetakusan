using Serilog.Core;
using Serilog.Events;

namespace AnimeTakusan.API.Serilog;

public class LocalTimeEnricher : ILogEventEnricher
{
    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(
            "LocalTime",
            logEvent.Timestamp.ToLocalTime()));
    }
}
